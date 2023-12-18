import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  NotificationService,
  toastTypes,
} from 'src/app/shared/services/notification.service';

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
import { HttpAuthService } from 'src/app/core/services/auth-http.service';

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
          tap(() => {
            this.notificationService.initiate({
              title: 'Success',
              content: `Your name have updated to ${data.name} successfully!`,
              type: toastTypes.success,
            });
          }),
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
            this.notificationService.initiate({
              title: 'Success',
              content: `See You later!`,
              type: toastTypes.success,
            });
          }),
          switchMap(() => of(deleteLoginSuccess())),
          catchError(() => of({ type: 'ERROR_ACTION' }))
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private httpService: HttpAuthService,
    private notificationService: NotificationService
  ) {}
}
