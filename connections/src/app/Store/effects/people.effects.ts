import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TuiDialogService } from '@taiga-ui/core';
import { catchError, EMPTY, exhaustMap, map, mergeMap, take, tap } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';

import {
  PeopleConversationsListResponseBody,
  PeopleItem,
  PeopleListResponseBody,
} from 'src/app/shared/models/people-model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import {
  setPeopleConversationID,
  setPeopleConversationIDSuccess,
  setPeopleConversationsListData,
  setPeopleListData,
} from '../actions/actions';
import { createHeaders } from './effect-utils';

@Injectable()
export class PeopleEffects {
  loadPeopleListData$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[People List] Set People List Data'),
      exhaustMap(() => {
        const headers = createHeaders();
        return this.httpService.getPeopleList({ headers }).pipe(
          take(1),
          mergeMap((peopleData: PeopleListResponseBody) => {
            const mergedData: PeopleItem[] = peopleData.Items.map((item) => ({
              ...item,
              hasConversation: false,
            }));

            return this.httpService
              .getPeopleConversationsList({ headers })
              .pipe(
                take(1),
                map(
                  (conversationsData: PeopleConversationsListResponseBody) => {
                    mergedData.forEach((person) => {
                      person.hasConversation = conversationsData.Items.some(
                        (conversation) =>
                          conversation.companionID.S === person.uid.S
                      );
                    });

                    this.store.dispatch(
                      setPeopleListData({
                        data: { Count: mergedData.length, Items: mergedData },
                      })
                    );
                    this.store.dispatch(
                      setPeopleConversationsListData({
                        data: conversationsData,
                      })
                    );
                    return { type: '[People List] Load Data Success' };
                  }
                ),
                catchError(() => EMPTY)
              );
          }),
          catchError(() => EMPTY)
        );
      })
    )
  );

  createPeopleConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setPeopleConversationID),
      exhaustMap((action) => {
        const headers = createHeaders();
        const body = { companion: action.companion };
        console.log('effect createPeopleConversation$ ', body);

        return this.httpService
          .createPeopleConversation(body.companion, { headers })
          .pipe(
            tap((conversationID) =>
              console.log(
                'createPeopleConversation conversationID:',
                conversationID
              )
            ),
            map((conversationID) =>
              setPeopleConversationIDSuccess({ conversationID })
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
