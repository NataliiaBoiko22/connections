import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TuiDialogService } from '@taiga-ui/core';
import { HttpService } from 'src/app/core/services/http.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import {
  catchError,
  EMPTY,
  exhaustMap,
  finalize,
  map,
  mergeMap,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { ProfileResponseBody } from 'src/app/shared/models/profile-model';

import {
  deleteLoginSuccess,
  setProfileData,
  updateName,
} from '../actions/actions';
import {
  createHeaders,
  transformUnixTimestampToReadableDate,
} from './effect-utils';

@Injectable()
export class AuthEffects {
  loadProfileData$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Profile] Set Profile Data'),
      exhaustMap(() => {
        const headers = createHeaders();
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
        const headers = createHeaders();
        return this.httpService.editProfile({ headers }, data).pipe(
          map(() => updateName({ name: data.name })),
          catchError(() => EMPTY)
        );
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Profile] Delete Login'),
      exhaustMap(() => {
        const headers = createHeaders();

        return this.httpService.deleteLogin({ headers }).pipe(
          take(1),
          tap(() => {
            this.dialogService
              .open('You have logged out successfully!', {
                label: 'Success',
                size: 's',
              })
              .subscribe();
          }),
          switchMap(() => of(deleteLoginSuccess())),
          catchError(() => of({ type: 'ERROR_ACTION' })),
          finalize(() => console.log('Logout effect completed'))
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private httpService: HttpService,
    private dialogService: TuiDialogService,
    private store: Store,
    private notificationService: NotificationService
  ) {}
}
