import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiDialogService } from '@taiga-ui/core';
import { SignUpBody } from 'src/app/shared/models/auth-models';
import {
  EditProfileBody,
  ProfileResponseBody,
} from 'src/app/shared/models/profile-models';
import { setProfileData, updateName } from 'src/app/Store/actions/actions';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private httpService: HttpService,
    private store: Store,
    private router: Router,
    private dialogService: TuiDialogService
  ) {}

  getProfile(userId: string, userEmail: string, authToken: string): void {
    const headers = {
      'rs-uid': userId,
      'rs-email': userEmail,
      Authorization: `Bearer ${authToken}`,
    };

    this.httpService.getProfileData({ headers }).subscribe({
      next: (data: ProfileResponseBody) => {
        this.store.dispatch(setProfileData({ data }));
      },
      error: (error: any) => {
        console.error('Failed to fetch profile data', error);
      },
    });
  }

  transformProfileData(data: ProfileResponseBody): ProfileResponseBody {
    if (data && data.createdAt && data.createdAt.S) {
      const createdAtDate = new Date(Number(data.createdAt.S));
      if (!isNaN(createdAtDate.getTime())) {
        return {
          ...data,
          createdAt: {
            ...data.createdAt,
            S: createdAtDate.toLocaleString(),
          },
        };
      }
    }
    return data;
  }

  editUserProfile(
    userId: string,
    userEmail: string,
    authToken: string,
    data: EditProfileBody
  ) {
    const headers = {
      'rs-uid': userId,
      'rs-email': userEmail,
      Authorization: `Bearer ${authToken}`,
    };
    this.httpService.editProfile({ headers }, data).subscribe((resp) => {
      if (resp === null) {
        this.store.dispatch(updateName({ name: data.name }));
        this.dialogService
          .open('Your name updated successfully!', {
            label: 'Success',
            size: 's',
          })
          .subscribe();
      }
    });
  }
}
