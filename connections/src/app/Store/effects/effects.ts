import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
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
import { ProfileResponseBody } from 'src/app/shared/models/profile-models';
import {
  createGroup,
  createGroupSuccess,
  deleteGroup,
  deleteGroupSuccess,
  setGroupListData,
  setPeopleListData,
  setProfileData,
  updateName,
} from '../actions/actions';
import { selectProfileData } from '../selectors/selectors';

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
          mergeMap((data) => {
            const transformedData = this.transformProfileData(data);
            return [setProfileData({ data: transformedData })];
          }),
          catchError(() => EMPTY)
        );
      })
    )
  );

  private transformProfileData(data: ProfileResponseBody): ProfileResponseBody {
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
        const userId = localStorage.getItem('uid') as string;
        const userEmail = localStorage.getItem('email') as string;
        const authToken = localStorage.getItem('token') as string;
        const headers = {
          'rs-uid': userId,
          'rs-email': userEmail,
          Authorization: `Bearer ${authToken}`,
        };

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

  // loadGoupsListData$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType('[Group List] Set Group List Data'),
  //     take(1),
  //     mergeMap(() => {
  //       const headers = this.createHeaders();
  //       return this.httpService.getGroupList({ headers }).pipe(
  //         map((data) => setGroupListData({ data })),
  //         catchError(() => EMPTY)
  //       );
  //     })
  //   )
  // );
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
      take(1),
      mergeMap(() => {
        const headers = this.createHeaders();
        return this.httpService.getPeopleList({ headers }).pipe(
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
      exhaustMap((action) =>
      {
        const headers = this.createHeaders();
        const params = { groupID: action.groupID };
        return this.httpService.deleteGroup({ headers }, params).pipe(
          take(1),
          exhaustMap(() =>
          {
            this.dialogService
              .open('Your group removed successfully!', {
                label: 'Success',
                size: 's',
              })
              .subscribe();
            return of({ type: 'NO_ACTION' });
          }),
          catchError(() => of({ type: 'ERROR_ACTION' }))
  
        )
      }
  )))
  constructor(
    private actions$: Actions,
    private httpService: HttpService,
    private dialogService: TuiDialogService
  ) {}
}
