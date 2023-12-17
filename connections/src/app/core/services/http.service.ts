import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import {
  catchError,
  delay,
  EMPTY,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import {
  SignInBody,
  SignInResponseBody,
  SignUpBody,
  SignUpResponse,
} from 'src/app/shared/models/auth-models';
import { HttpErrorService } from './http-error.service';
import {
  EditProfileBody,
  ProfileResponseBody,
} from 'src/app/shared/models/profile-model';
import { Store } from '@ngrx/store';
import { setEmailError } from 'src/app/Store/actions/actions';
import {
  GroupListResponseBody,
  RequestGroupItem,
  ResponseGroupID,
} from 'src/app/shared/models/groups-model';
import {
  PeopleConversationsListResponseBody,
  PeopleListResponseBody,
} from 'src/app/shared/models/people-model';
import {
  GroupMessagesRequestBody,
  GroupMessagesResponseBody,
} from 'src/app/shared/models/group-messages-model';
import {
  RequestHeaders,
  ResponseSinceTimestamp,
} from 'src/app/shared/models/http-model';
import {
  PeopleConversationRequestBody,
  PeopleConversationResonseBody,
  PeopleMessagesRequestBody,
  PeopleMessagesResponseBody,
} from 'src/app/shared/models/people-messages-model';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  url = ' https://tasks.app.rs.school/angular';

  signUpPath = '/registration';
  singInPath = '/login';
  getProfilePath = '/profile';
  deleteProfilePath = '/logout';
  getGroupsListPath = '/groups/list';
  postGroupsPath = '/groups/create';
  getPeopleListPath = '/users';
  deleteGroupPath = '/groups/delete';
  getGroupMessagesPath = '/groups/read';
  postGroupMessagesPath = '/groups/append';
  getPeopleConversationsListPath = '/conversations/list';
  postPeopleConversationPath = '/conversations/create';
  getPeopleMessagesPath = '/conversations/read';

  postPeopleMessagesPath = '/conversations/append';
  deletePeopleConversationPath = '/conversations/delete';
  constructor(
    private httpClient: HttpClient,
    private httpError: HttpErrorService,
    private store: Store,
    private httpErrorService: HttpErrorService
  ) {}

  // public signUp(params: SignUpBody) {
  //   return this.httpClient
  //     .post<SignUpResponse>(this.url + this.signUpPath, params)
  //     .pipe(
  //       catchError((err: HttpErrorResponse) =>
  //         this.httpErrorService.handleHttpError<SignUpResponse>(err)
  //       )
  //     );
  // }

  // // private handleHttpError<T>(err: HttpErrorResponse): Observable<T> {
  // //   console.log('err', err);
  // //   this.store.dispatch(setEmailError({ emailError: true }));

  // //   return this.httpError.catchErrors(err).pipe(switchMap(() => EMPTY));
  // // }

  // public singIn(params: SignInBody): Observable<SignInResponseBody> {
  //   return this.httpClient
  //     .post<SignInResponseBody>(this.url + this.singInPath, params)
  //     .pipe(
  //       catchError((err: HttpErrorResponse) =>
  //         this.httpErrorService.handleHttpError<SignInResponseBody>(err)
  //       )
  //     );
  // }

  // getProfileData({ headers }: RequestHeaders): Observable<ProfileResponseBody> {
  //   console.log('getProfileData from httpService');

  //   return this.httpClient
  //     .get<ProfileResponseBody>(this.url + this.getProfilePath, {
  //       headers,
  //     })
  //     .pipe(
  //       catchError((err: HttpErrorResponse) =>
  //         this.httpErrorService.handleHttpError<ProfileResponseBody>(err)
  //       )
  //     );
  // }

  // public editProfile({ headers }: RequestHeaders, params: EditProfileBody) {
  //   return this.httpClient
  //     .put<SignUpResponse>(this.url + this.getProfilePath, params, {
  //       headers,
  //     })
  //     .pipe(
  //       catchError((err: HttpErrorResponse) =>
  //         this.httpErrorService.handleHttpError<SignUpResponse>(err)
  //       )
  //     );
  // }

  // public deleteLogin({ headers }: RequestHeaders) {
  //   console.log('deleteLogin from httpService');

  //   return this.httpClient
  //     .delete(this.url + this.deleteProfilePath, {
  //       headers,
  //     })
  //     .pipe(
  //       catchError((err: HttpErrorResponse) =>
  //         this.httpErrorService.handleHttpError(err)
  //       )
  //     );
  // }

  // public getGroupList({
  //   headers,
  // }: RequestHeaders): Observable<GroupListResponseBody> {
  //   console.log('getGroupList from httpService');
  //   return this.httpClient
  //     .get<GroupListResponseBody>(this.url + this.getGroupsListPath, {
  //       headers,
  //     })
  //     .pipe(
  //       catchError((err: HttpErrorResponse) =>
  //         this.httpErrorService.handleHttpError<GroupListResponseBody>(err)
  //       )
  //     );
  // }

  // public getPeopleList({
  //   headers,
  // }: RequestHeaders): Observable<PeopleListResponseBody> {
  //   console.log('getPeopleList from httpService');

  //   return this.httpClient
  //     .get<PeopleListResponseBody>(this.url + this.getPeopleListPath, {
  //       headers,
  //     })
  //     .pipe(
  //       catchError((err: HttpErrorResponse) =>
  //         this.httpErrorService.handleHttpError<PeopleListResponseBody>(err)
  //       )
  //     );
  // }

  // public createNewGroup(
  //   { headers }: RequestHeaders,
  //   params: RequestGroupItem
  // ): Observable<ResponseGroupID> {
  //   console.log('createNewGroup from httpService');

  //   return this.httpClient
  //     .post<ResponseGroupID>(this.url + this.postGroupsPath, params, {
  //       headers,
  //     })
  //     .pipe(
  //       catchError((err: HttpErrorResponse) =>
  //         this.httpErrorService.handleHttpError<ResponseGroupID>(err)
  //       )
  //     );
  // }

  // public deleteGroup({ headers }: RequestHeaders, groupID: ResponseGroupID) {
  //   const params = new HttpParams().set('groupID', groupID.groupID);
  //   return this.httpClient
  //     .delete(this.url + this.deleteGroupPath, { headers, params })
  //     .pipe(
  //       catchError((err: HttpErrorResponse) =>
  //         this.httpErrorService.handleHttpError(err)
  //       )
  //     );
  // }

  // public getGroupMessages(
  //   { headers }: RequestHeaders,
  //   groupID: ResponseGroupID,
  //   since?: ResponseSinceTimestamp
  // ) {
  //   let params = new HttpParams().set('groupID', groupID.groupID);

  //   if (since?.since !== undefined) {
  //     params = params.set('since', String(since.since));
  //   }

  //   const apiUrl =
  //     this.url + this.getGroupMessagesPath + '?' + params.toString();
  //   console.log('getGroupMessages API URL:', apiUrl);

  //   return this.httpClient
  //     .get<GroupMessagesResponseBody>(apiUrl, {
  //       headers,
  //     })
  //     .pipe(
  //       catchError((err: HttpErrorResponse) =>
  //         this.httpErrorService.handleHttpError<GroupMessagesResponseBody>(err)
  //       )
  //     );
  // }

  // public sendGroupMessages(
  //   body: GroupMessagesRequestBody,
  //   headers: RequestHeaders
  // ) {
  //   console.log('sendGroupMessages from httpService');

  //   return this.httpClient
  //     .post(this.url + this.postGroupMessagesPath, body, headers)
  //     .pipe(
  //       catchError((err: HttpErrorResponse) =>
  //         this.httpErrorService.handleHttpError(err)
  //       )
  //     );
  // }

  // public getPeopleConversationsList({
  //   headers,
  // }: RequestHeaders): Observable<PeopleConversationsListResponseBody> {
  //   console.log('getPeopleConversationsList from httpService');

  //   return this.httpClient
  //     .get<PeopleConversationsListResponseBody>(
  //       this.url + this.getPeopleConversationsListPath,
  //       {
  //         headers,
  //       }
  //     )
  //     .pipe(
  //       catchError((err: HttpErrorResponse) =>
  //         this.httpErrorService.handleHttpError<PeopleConversationsListResponseBody>(
  //           err
  //         )
  //       )
  //     );
  // }

  // public createPeopleConversation(
  //   body: PeopleConversationRequestBody,
  //   { headers }: RequestHeaders
  // ): Observable<PeopleConversationResonseBody> {
  //   console.log('createPeopleConversation from httpService');

  //   return this.httpClient
  //     .post<PeopleConversationResonseBody>(
  //       this.url + this.postPeopleConversationPath,
  //       body,
  //       {
  //         headers,
  //       }
  //     )
  //     .pipe(
  //       catchError((err: HttpErrorResponse) =>
  //         this.httpErrorService.handleHttpError<PeopleConversationResonseBody>(
  //           err
  //         )
  //       )
  //     );
  // }

  // public getPeopleMessages(
  //   { headers }: RequestHeaders,
  //   conversationID: PeopleMessagesRequestBody,
  //   since?: ResponseSinceTimestamp
  // ) {
  //   let params = new HttpParams().set(
  //     'conversationID',
  //     conversationID.conversationID
  //   );

  //   if (since?.since !== undefined) {
  //     params = params.set('since', String(since.since));
  //   }

  //   const apiUrl =
  //     this.url + this.getPeopleMessagesPath + '?' + params.toString();
  //   console.log('getPeopleMessages API URL:', apiUrl);

  //   return this.httpClient
  //     .get<PeopleMessagesResponseBody>(apiUrl, {
  //       headers,
  //     })
  //     .pipe(
  //       catchError((err: HttpErrorResponse) =>
  //         this.httpErrorService.handleHttpError<PeopleMessagesResponseBody>(err)
  //       )
  //     );
  // }
  // public sendPeopleMessages(
  //   body: PeopleMessagesRequestBody,
  //   headers: RequestHeaders
  // ) {
  //   console.log('sendPeopleMessages from httpService');

  //   return this.httpClient
  //     .post(this.url + this.postPeopleMessagesPath, body, headers)
  //     .pipe(
  //       catchError((err: HttpErrorResponse) =>
  //         this.httpErrorService.handleHttpError(err)
  //       )
  //     );
  // }

  // public deletePeopleConversation(
  //   { headers }: RequestHeaders,
  //   conversationID: PeopleMessagesRequestBody
  // ) {
  //   const params = new HttpParams().set(
  //     'conversationID',
  //     conversationID.conversationID
  //   );
  //   return this.httpClient
  //     .delete(this.url + this.deletePeopleConversationPath, { headers, params })
  //     .pipe(
  //       catchError((err: HttpErrorResponse) =>
  //         this.httpErrorService.handleHttpError(err)
  //       )
  //     );
  // }
}
