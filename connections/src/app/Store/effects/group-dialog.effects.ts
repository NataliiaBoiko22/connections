import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TuiDialogService } from '@taiga-ui/core';
import {
  catchError,
  EMPTY,
  exhaustMap,
  map,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { GroupMessagesResponseBody } from 'src/app/shared/models/group-messages-model';
import { ResponseGroupID } from 'src/app/shared/models/groups-model';
import { ResponseSinceTimestamp } from 'src/app/shared/models/http-model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import {
  sendGroupMessagesData,
  sendGroupMessagesDataSuccess,
  setGroupMessagesData,
  setGroupMessagesDataSuccess,
} from '../actions/actions';
import { selectPeopleList } from '../selectors/selectors';
import { createHeaders, getLastReceivedTimestampGroup } from './effect-utils';

@Injectable()
export class GroupDialogEffects {
  loadGroupsMessagesData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setGroupMessagesData),
      withLatestFrom(this.store.pipe(select(selectPeopleList))),
      exhaustMap(([action, peopleList]) => {
        const headers = createHeaders();
        const paramsID: ResponseGroupID = { groupID: action.groupID };
        const paramsSince: ResponseSinceTimestamp = {
          since: action.since,
        };

        console.log(
          'params from effect loadGroupsMessagesData',
          paramsID,
          paramsSince
        );
        return this.httpService
          .getGroupMessages({ headers }, paramsID, paramsSince)

          .pipe(
            take(1),
            map((data: GroupMessagesResponseBody) => {
              console.log('data from http in effect', data);
              const lastTimestampInGroup = getLastReceivedTimestampGroup(
                data,
                action.groupID,
                this.store
              );
              const transformedData: GroupMessagesResponseBody = {
                groupID: action.groupID,
                lastTimestampInGroup: lastTimestampInGroup,

                Count: data.Count,
                Items: data.Items.map((item) => {
                  const authorItem = peopleList.Items.find(
                    (person) => person.uid.S === item.authorID.S
                  );
                  const authorName = authorItem
                    ? authorItem.name.S
                    : 'Unknown Author';

                  return {
                    ...item,
                    createdAt: {
                      S: item.createdAt.S,
                    },
                    authorName: authorName,
                  };
                }),
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
        const headers = createHeaders();
        const body = {
          groupID: action.groupID,
          message: action.message,
        };
        console.log('effect sendGoupMessageData', body, { headers });

        return this.httpService.sendGroupMessages(body, { headers }).pipe(
          tap(() => console.log('after this.httpService.sendGroupMessages')),
          map(() =>
            sendGroupMessagesDataSuccess({
              groupID: action.groupID,
              authorID: action.authorID,
              message: action.message,
            })
          ),
          catchError(() => EMPTY)
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
