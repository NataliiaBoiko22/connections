import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TuiItemDirective } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import {
  catchError,
  EMPTY,
  exhaustMap,
  filter,
  map,
  mergeMap,
  of,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { GroupMessagesResponseBody } from 'src/app/shared/models/group-messages';
import { ProfileResponseBody } from 'src/app/shared/models/profile-models';
import {
  createGroup,
  createGroupSuccess,
  deleteGroup,
  deleteGroupSuccess,
  sendGroupMessagesData,
  setGroupListData,
  setGroupMessagesData,
  setGroupMessagesDataSuccess,
  setPeopleListData,
  setProfileData,
  updateName,
} from '../actions/actions';
import { selectProfileData } from '../selectors/selectors';
import { transformUnixTimestampToReadableDate } from './date-utils';

@Injectable()
export class ConnectionsEffects {
  private createHeaders(): Record<string, string> {
    const userId = localStorage.getItem('uid') as string;
    const userEmail = localStorage.getItem('email') as string;
    const authToken = localStorage.getItem('token') as string;

    return {
      'rs-uid': userId,
      'rs-email': userEmail,
      Authorization: `Bearer ${authToken}`,
    };
  }

  loadProfileData$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Profile] Set Profile Data'),
      exhaustMap(() => {
        const headers = this.createHeaders();
        return this.httpService.getProfileData({ headers }).pipe(
          take(1),
          map((data: ProfileResponseBody) => {
            if (data && data.createdAt && data.createdAt.S) {
              return setProfileData({
                data: {
                  ...data,
                  createdAt: {
                    ...data.createdAt,
                    S: transformUnixTimestampToReadableDate(data.createdAt.S),
                  },
                },
              });
            } else {
              return setProfileData({ data });
            }
          }),
          catchError(() => EMPTY)
        );
      })
    )
  );

  editProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateName),
      take(1),
      mergeMap((data) => {
        const headers = this.createHeaders();
        return this.httpService.editProfile({ headers }, data).pipe(
          map(() => updateName({ name: data.name })),
          catchError(() => EMPTY)
        );
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Profile] Logout'),
      exhaustMap(() => {
        const headers = this.createHeaders();

        return this.httpService.deleteLogin({ headers }).pipe(
          take(1),
          exhaustMap(() => {
            this.dialogService
              .open('You have logged out successfully!', {
                label: 'Success',
                size: 's',
              })
              .subscribe();
            return of({ type: 'NO_ACTION' });
          }),
          catchError(() => of({ type: 'ERROR_ACTION' }))
        );
      })
    )
  );

  loadGoupsListData$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Group List] Set Group List Data'),
      exhaustMap(() => {
        const headers = this.createHeaders();
        return this.httpService.getGroupList({ headers }).pipe(
          take(1),
          map((data) => setGroupListData({ data })),
          catchError(() => EMPTY)
        );
      })
    )
  );

  loadPeopleListData$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[People List] Set People List Data'),
      exhaustMap(() => {
        const headers = this.createHeaders();
        return this.httpService.getPeopleList({ headers }).pipe(
          take(1),
          map((data) => setPeopleListData({ data })),
          catchError(() => EMPTY)
        );
      })
    )
  );

  createGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createGroup),
      exhaustMap((action) => {
        const headers = this.createHeaders();
        const params = { name: action.name };
        return this.httpService.createNewGroup({ headers }, params).pipe(
          tap((groupID) => console.log('createGroup groupID:', groupID)),
          map((groupID) => createGroupSuccess({ groupID, name: action.name })),
          catchError(() => EMPTY)
        );
      })
    )
  );

  deleteGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteGroup),
      exhaustMap((action) => {
        const headers = this.createHeaders();
        const params = { groupID: action.groupID };
        return this.httpService.deleteGroup({ headers }, params).pipe(
          take(1),
          exhaustMap(() => {
            this.dialogService
              .open('Your group removed successfully!', {
                label: 'Success',
                size: 's',
              })
              .subscribe();
            return of({ type: 'NO_ACTION' });
          }),
          catchError(() => of({ type: 'ERROR_ACTION' }))
        );
      })
    )
  );

  loadGoupsMessagesData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setGroupMessagesData),
      exhaustMap((action) => {
        const headers = this.createHeaders();
        const params = { groupID: action.groupID };
        return this.httpService.getGroupMessages({ headers }, params).pipe(
          take(1),
          map((data: GroupMessagesResponseBody) => {
            const transformedData = {
              Count: data.Count,
              Items: data.Items.map((item) => ({
                ...item,
                createdAt: {
                  S: transformUnixTimestampToReadableDate(item.createdAt.S),
                },
              })),
            };
            return setGroupMessagesDataSuccess({ data: transformedData });
          }),
          catchError(() => EMPTY)
        );
      })
    )
  );

  sendGoupMessageData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendGroupMessagesData),
      exhaustMap((action) => {
        const headers = this.createHeaders();
        const body = {
          groupID: action.groupID,
          message: action.message,
        };
        console.log('effect sendGoupMessageData', body, { headers });

        return this.httpService.sendGroupMessages(body, { headers }).pipe(
          exhaustMap((resp) => {
            console.log(resp);
            return of({ type: 'NO_ACTION' });
          }),
          catchError(() => of({ type: 'ERROR_ACTION' }))
        );
      })
    )
  );
  constructor(
    private actions$: Actions,
    private httpService: HttpService,
    private dialogService: TuiDialogService
  ) {}
}
