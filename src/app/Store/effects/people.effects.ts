import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  concatMap,
  EMPTY,
  exhaustMap,
  map,
  mergeMap,

  take,

} from 'rxjs';
import { HttpPeopleService } from 'src/app/core/services/people-http.service';

import {
  PeopleConversationsListResponseBody,
  PeopleItem,
  PeopleListResponseBody,
} from 'src/app/shared/models/people-model';
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
                      const conversation = conversationsData.Items.find(
                        (conversation) =>
                          conversation.companionID.S === person.uid.S
                      );

                      if (conversation) {
                        person.hasConversation = true;
                        person.conversationId = conversation.id.S;
                      }
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
      concatMap((action) => {
        const headers = createHeaders();
        const body = { companion: action.companion };
        return this.httpService
          .createPeopleConversation(body.companion, { headers })

          .pipe(
            take(1),
            map((conversationID) =>
              setPeopleConversationIDSuccess({
                conversationID,
                companion: action.companion,
              })
            ),

            catchError(() => EMPTY)
          );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private httpService: HttpPeopleService,
    private store: Store,
  ) {}
}
