import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TuiDialogService } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
import {
  catchError,
  EMPTY,
  exhaustMap,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { HttpGroupService } from 'src/app/core/services/group-http.service';
import {
  NotificationService,
  toastTypes,
} from 'src/app/shared/services/notification.service';
import {
  createGroup,
  createGroupSuccess,
  deleteGroup,
  deleteGroupSuccess,
  setGroupListData,
} from '../actions/actions';
import { createHeaders } from './effect-utils';

@Injectable()
export class GroupEffects {
  loadGoupsListData$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Group List] Set Group List Data'),
      exhaustMap(() => {
        const headers = createHeaders();
        return this.httpService.getGroupList({ headers }).pipe(
          take(1),
          map((data) => setGroupListData({ data })),
          catchError(() => EMPTY)
        );
      })
    )
  );

  createGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createGroup),
      exhaustMap((action) => {
        const headers = createHeaders();
        const params = { name: action.name };
        return this.httpService.createNewGroup({ headers }, params).pipe(
          tap(() => {
            this.notificationService.initiate({
              title: 'Success',
              content: `Your group ${action.name} created successfully!`,
              type: toastTypes.success,
            });
          }),
          map((groupID) => createGroupSuccess({ groupID, name: action.name })),
          catchError(() => EMPTY)
        );
      })
    )
  );

  deleteGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteGroup),
      switchMap((action) => {
        return this.dialogService
          .open<boolean>(TUI_PROMPT, {
            label: `Do you want to delete ${action.name}  group?`,
            size: 's',
            data: {
              yes: 'OK',
              no: 'No',
            },
          })
          .pipe(
            switchMap((response) => {
              if (response) {
                const headers = createHeaders();
                const params = { groupID: action.groupID };

                return this.httpService.deleteGroup({ headers }, params).pipe(
                  take(1),
                  tap(() => {
                    this.notificationService.initiate({
                      title: 'Success',
                      content: `Your group ${action.name} removed successfully!`,
                      type: toastTypes.success,
                    });
                  }),
                  map(() => deleteGroupSuccess({ groupID: action.groupID })),
                  catchError(() => of({ type: 'ERROR_ACTION' }))
                );
              } else {
                return EMPTY;
              }
            })
          );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private httpService: HttpGroupService,
    private dialogService: TuiDialogService,
    private notificationService: NotificationService
  ) {}
}
