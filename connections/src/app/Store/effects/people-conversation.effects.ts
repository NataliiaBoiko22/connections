import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TuiDialogService } from '@taiga-ui/core';
import {
  catchError,
  EMPTY,
  exhaustMap,
  map,
  of,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { ResponseSinceTimestamp } from 'src/app/shared/models/http-model';
import {
  PeopleMessagesRequestBody,
  PeopleMessagesResponseBody,
} from 'src/app/shared/models/people-messages-model';
import {
  NotificationService,
  toastTypes,
} from 'src/app/shared/services/notification.service';
import {
  deletePeopleConversation,
  deletePeopleConversationSuccess,
  sendPeopleMessagesData,
  sendPeopleMessagesDataSuccess,
  setPeopleMessagesData,
  setPeopleMessagesDataSuccess,
} from '../actions/actions';
import { selectPeopleList } from '../selectors/selectors';
import { createHeaders, getLastReceivedTimestampPeople } from './effect-utils';

@Injectable()
export class PeopleConversationEffects {
  loadPeopleMessagesData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setPeopleMessagesData),
      withLatestFrom(this.store.pipe(select(selectPeopleList))),
      exhaustMap(([action, peopleList]) => {
        const headers = createHeaders();
        const paramsID: PeopleMessagesRequestBody = {
          conversationID: action.conversationID,
        };
        const paramsSince: ResponseSinceTimestamp = {
          since: action.since,
        };

        console.log(
          'params from effect loadGroupsMessagesData',
          paramsID,
          paramsSince
        );
        return this.httpService
          .getPeopleMessages({ headers }, paramsID, paramsSince)

          .pipe(
            take(1),
            map((data: PeopleMessagesResponseBody) => {
              console.log('data from http in effect', data);
              const lastTimestampInPeople = getLastReceivedTimestampPeople(
                data,
                action.conversationID,
                this.store
              );

              const transformedData: PeopleMessagesResponseBody = {
                conversationID: action.conversationID,
                Count: data.Count,
                lastTimestampInPeople: lastTimestampInPeople,
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
              return setPeopleMessagesDataSuccess({
                data: transformedData,
              });
            }),

            catchError(() => EMPTY)
          );
      })
    )
  );

  sendPeopleMessageData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendPeopleMessagesData),
      exhaustMap((action) => {
        const headers = createHeaders();
        const body = {
          conversationID: action.conversationID,
          message: action.message,
        };
        console.log('effect sendPeopleMessageData', body, { headers });

        return this.httpService.sendPeopleMessages(body, { headers }).pipe(
          tap(() => console.log('after this.httpService.sendPeopleMessages')),
          map(() =>
            sendPeopleMessagesDataSuccess({
              conversationID: action.conversationID,
              authorID: action.authorID,
              message: action.message,
            })
          ),
          catchError(() => EMPTY)
        );
      })
    )
  );
  deletePeopleConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deletePeopleConversation),
      exhaustMap((action) => {
        const headers = createHeaders();
        const params = { conversationID: action.conversationID };
        return this.httpService
          .deletePeopleConversation({ headers }, params)
          .pipe(
            take(1),
            tap(() => {
              this.notificationService.initiate({
                title: 'Success',
                content: `Your conversation removed successfully!`,
                type: toastTypes.success,
              });
            }),
            map(() =>
              deletePeopleConversationSuccess({
                conversationID: action.conversationID,
              })
            ),
            catchError(() => of({ type: 'ERROR_ACTION' }))
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
