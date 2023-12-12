import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TuiDialogService } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
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
  withLatestFrom,
} from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { GroupMessagesResponseBody } from 'src/app/shared/models/group-messages-model';
import { ResponseGroupID } from 'src/app/shared/models/groups-model';
import { ResponseSinceTimestamp } from 'src/app/shared/models/http-model';
import {
  PeopleMessagesRequestBody,
  PeopleMessagesResponseBody,
} from 'src/app/shared/models/people-messages-model';
import {
  MergedData,
  PeopleConversationsListResponseBody,
  PeopleItem,
  PeopleListResponseBody,
} from 'src/app/shared/models/people-model';
import { ProfileResponseBody } from 'src/app/shared/models/profile-model';
import {
  NotificationService,
  toastTypes,
} from 'src/app/shared/services/notification.service';
import {
  createGroup,
  createGroupSuccess,
  deleteGroup,
  deleteGroupSuccess,
  deleteLoginSuccess,
  deletePeopleConversation,
  deletePeopleConversationSuccess,
  sendGroupMessagesData,
  sendGroupMessagesDataSuccess,
  sendPeopleMessagesData,
  sendPeopleMessagesDataSuccess,
  setGroupListData,
  setGroupMessagesData,
  setGroupMessagesDataSuccess,
  setPeopleConversationID,
  setPeopleConversationIDSuccess,
  setPeopleConversationsListData,
  setPeopleListData,
  setPeopleMessagesData,
  setPeopleMessagesDataSuccess,
  setProfileData,
  updateName,
} from '../actions/actions';
import { selectPeopleList } from '../selectors/selectors';
import {
  getLastReceivedTimestamp,
  getLastReceivedTimestampPeople,
  mergePeopleAndConversationsData,
  transformUnixTimestampToReadableDate,
} from './effect-utils';

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
      ofType('[Profile] Delete Login'),
      exhaustMap(() => {
        const headers = this.createHeaders();

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
  // loadPeopleConversationsListData$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType('[People List] Set People Conversations List Data'),
  //     exhaustMap(() => {
  //       const headers = this.createHeaders();
  //       return this.httpService.getPeopleConversationsList({ headers }).pipe(
  //         take(1),
  //         map((data) => setPeopleConversationsListData({ data })),
  //         catchError(() => EMPTY)
  //       );
  //     })
  //   )
  // );

  createGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createGroup),
      exhaustMap((action) => {
        const headers = this.createHeaders();
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
                const headers = this.createHeaders();
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

  loadGroupsMessagesData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setGroupMessagesData),
      withLatestFrom(this.store.pipe(select(selectPeopleList))),
      exhaustMap(([action, peopleList]) => {
        const headers = this.createHeaders();
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
              const transformedData: GroupMessagesResponseBody = {
                groupID: action.groupID,
                lastTimestampInGroup: getLastReceivedTimestamp(data),

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
        const headers = this.createHeaders();
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
  //  .........................................................................................................

  createPeopleConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setPeopleConversationID),
      exhaustMap((action) => {
        const headers = this.createHeaders();
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

  loadPeopleMessagesData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setPeopleMessagesData),
      withLatestFrom(this.store.pipe(select(selectPeopleList))),
      exhaustMap(([action, peopleList]) => {
        const headers = this.createHeaders();
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
              const transformedData: PeopleMessagesResponseBody = {
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
                    lastTimestamp: getLastReceivedTimestampPeople(data),
                  };
                }),
              };
              return setPeopleMessagesDataSuccess({ data: transformedData });
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
        const headers = this.createHeaders();
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
        const headers = this.createHeaders();
        const params = { conversationID: action.conversationID };
        return this.httpService
          .deletePeopleConversation({ headers }, params)
          .pipe(
            take(1),
            tap(() => {
              this.dialogService
                .open('Your conversation removed successfully!', {
                  label: 'Success',
                  size: 's',
                })
                .subscribe();
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
