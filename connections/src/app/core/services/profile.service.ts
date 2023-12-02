import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiDialogService } from '@taiga-ui/core';
import {
  EditProfileBody,
  ProfileResponseBody,
} from 'src/app/shared/models/profile-models';
import {
  deleteLogin,
  setProfileData,
  updateName,
} from 'src/app/Store/actions/actions';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private httpService: HttpService,
    private store: Store,
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

  logout(userId: string, userEmail: string, authToken: string) {
    const headers = {
      'rs-uid': userId,
      'rs-email': userEmail,
      Authorization: `Bearer ${authToken}`,
    };
    this.httpService.deleteLogin({ headers }).subscribe((resp) => {
      if (resp === null) {
        this.store.dispatch(deleteLogin());
        this.dialogService
          .open('You have logged out successfully!', {
            label: 'Success',
            size: 's',
          })
          .subscribe();
      }
    });
    localStorage.clear();
    sessionStorage.clear();
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }
}
