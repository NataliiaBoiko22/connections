import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiDialogService } from '@taiga-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { GroupService } from 'src/app/main/services/group.service';
import { PeopleService } from 'src/app/main/services/people.service';
import { SignInBody, SignUpBody } from 'src/app/shared/models/auth-models';
import { GroupListResponseBody } from 'src/app/shared/models/groups-model';
import { PeopleListResponseBody } from 'src/app/shared/models/people-models';
import {
  setGroupListData,
  setPeopleListData,
} from 'src/app/Store/actions/actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public token = '';
  isSingInFromStorage = !!localStorage.getItem('token');
  isSingIn$ = new BehaviorSubject(this.isSingInFromStorage);

  constructor(
    private httpService: HttpService,
    private router: Router,
    private dialogService: TuiDialogService,
    private store: Store
  ) {}

  signUp(data: SignUpBody): void {
    this.httpService.signUp(data).subscribe((resp) => {
      if (resp === null) {
        this.router.navigate(['signin']);
        this.dialogService
          .open('Account Created Successfully!', {
            label: 'Success',
            size: 's',
          })
          .subscribe();
      }
    });
  }

  singIn(data: SignInBody): void {
    this.httpService.singIn(data).subscribe((respSingIn) => {
      if (typeof respSingIn === 'object' && 'token' in respSingIn) {
        this.isSingIn$.next(true);
        localStorage.setItem('token', respSingIn.token);
        localStorage.setItem('uid', respSingIn.uid);
        localStorage.setItem('email', data.email);
        this.router.navigate(['']);
        // this.setDataToStore(respSingIn.uid, data.email, respSingIn.token);
        // this.store.dispatch({ type: '[Group List] Set Group List Data' });
        // this.store.dispatch({ type: '[People List] Set People List Data' });

        this.dialogService
          .open('Welcome to Connections', {
            label: 'Success',
            size: 's',
          })
          .subscribe();
      }
    });
  }

  // setDataToStore(userId: string, userEmail: string, authToken: string): void {
  //   const headers = {
  //     'rs-uid': userId,
  //     'rs-email': userEmail,
  //     Authorization: `Bearer ${authToken}`,
  //   };
  //   this.httpService.getGroupList({ headers }).subscribe({
  //     next: (data: GroupListResponseBody) => {
  //       this.store.dispatch(setGroupListData({ data }));
  //     },
  //     error: (error: Error) => {
  //       console.error('Failed to fetch groups', error);
  //     },
  //   });
  //   this.httpService.getPeopleList({ headers }).subscribe({
  //     next: (data: PeopleListResponseBody) => {
  //       this.store.dispatch(setPeopleListData({ data }));
  //     },
  //     error: (error: Error) => {
  //       console.error('Failed to fetch groups', error);
  //     },
  //   });
  // }
}
