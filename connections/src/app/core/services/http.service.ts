import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import {
  catchError,
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
} from 'src/app/shared/models/profile-models';
import { Store } from '@ngrx/store';
import { setEmailError } from 'src/app/Store/actions/actions';
import {
  GroupListResponseBody,
  RequestGroupItem,
  ResponseGroupID,
} from 'src/app/shared/models/groups-model';
import { PeopleListResponseBody } from 'src/app/shared/models/people-models';
import {
  GroupMessagesResponseBody,
  RequestGroupMessagesBody,
} from 'src/app/shared/models/group-messages';
import {
  RequestHeaders,
  ResponseSinceTimestamp,
} from 'src/app/shared/models/http-models';
import {
  RequestConversationBody,
  ResponseCoversationBody,
} from 'src/app/shared/models/conversation-model';
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
  peopleListPath = '/users';
  deleteGroupPath = '/groups/delete';
  getGroupMessagesPath = '/groups/read';
  postGroupMessagesPath = '/groups/append';
  postPeopleConversationPath = '/conversations/create';
  constructor(
    private httpClient: HttpClient,
    private httpError: HttpErrorService,
    private store: Store
  ) {}

  public signUp(params: SignUpBody) {
    return this.httpClient
      .post<SignUpResponse>(this.url + this.signUpPath, params)
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.handleHttpError<SignUpResponse>(err)
        )
      );
  }

  private handleHttpError<T>(err: HttpErrorResponse): Observable<T> {
    console.log('err', err);
    this.store.dispatch(setEmailError({ emailError: true }));

    return this.httpError.catchErrors(err).pipe(switchMap(() => EMPTY));
  }

  public singIn(params: SignInBody): Observable<SignInResponseBody> {
    return this.httpClient
      .post<SignInResponseBody>(this.url + this.singInPath, params)
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.handleHttpError<SignInResponseBody>(err)
        )
      );
  }

  getProfileData({ headers }: RequestHeaders): Observable<ProfileResponseBody> {
    console.log('getProfileData from httpService');

    return this.httpClient
      .get<ProfileResponseBody>(this.url + this.getProfilePath, {
        headers,
      })
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.handleHttpError<ProfileResponseBody>(err)
        )
      );
  }

  public editProfile({ headers }: RequestHeaders, params: EditProfileBody) {
    return this.httpClient
      .put<SignUpResponse>(this.url + this.getProfilePath, params, {
        headers,
      })
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.handleHttpError<SignUpResponse>(err)
        )
      );
  }

  public deleteLogin({ headers }: RequestHeaders) {
    console.log('deleteLogin from httpService');

    return this.httpClient
      .delete(this.url + this.deleteProfilePath, {
        headers,
      })
      .pipe(catchError((err: HttpErrorResponse) => this.handleHttpError(err)));
  }

  public getGroupList({
    headers,
  }: RequestHeaders): Observable<GroupListResponseBody> {
    console.log('getGroupList from httpService');
    return this.httpClient
      .get<GroupListResponseBody>(this.url + this.getGroupsListPath, {
        headers,
      })
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.handleHttpError<GroupListResponseBody>(err)
        )
      );
  }

  public getPeopleList({
    headers,
  }: RequestHeaders): Observable<PeopleListResponseBody> {
    console.log('getPeopleList from httpService');

    return this.httpClient
      .get<PeopleListResponseBody>(this.url + this.peopleListPath, {
        headers,
      })
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.handleHttpError<PeopleListResponseBody>(err)
        )
      );
  }

  public createNewGroup(
    { headers }: RequestHeaders,
    params: RequestGroupItem
  ): Observable<ResponseGroupID> {
    console.log('createNewGroup from httpService');

    return this.httpClient
      .post<ResponseGroupID>(this.url + this.postGroupsPath, params, {
        headers,
      })
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.handleHttpError<ResponseGroupID>(err)
        )
      );
  }

  public deleteGroup({ headers }: RequestHeaders, groupID: ResponseGroupID) {
    const params = new HttpParams().set('groupID', groupID.groupID);
    return this.httpClient
      .delete(this.url + this.deleteGroupPath, { headers, params })
      .pipe(catchError((err: HttpErrorResponse) => this.handleHttpError(err)));
  }

  public getGroupMessages(
    { headers }: RequestHeaders,
    groupID: ResponseGroupID,
    since?: ResponseSinceTimestamp
  ) {
    let params = new HttpParams().set('groupID', groupID.groupID);

    if (since?.since !== undefined) {
      params = params.set('since', String(since.since));
    }

    const apiUrl =
      this.url + this.getGroupMessagesPath + '?' + params.toString();
    console.log('getGroupMessages API URL:', apiUrl);

    return this.httpClient
      .get<GroupMessagesResponseBody>(apiUrl, {
        headers,
      })
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.handleHttpError<GroupMessagesResponseBody>(err)
        )
      );
  }

  public sendGroupMessages(
    body: RequestGroupMessagesBody,
    headers: RequestHeaders
  ) {
    console.log('sendGroupMessages from httpService');

    return this.httpClient
      .post(this.url + this.postGroupMessagesPath, body, headers)
      .pipe(catchError((err: HttpErrorResponse) => this.handleHttpError(err)));
  }

  public createConversation(
    { headers }: RequestHeaders,
    body: RequestConversationBody
  ): Observable<ResponseCoversationBody> {
    console.log('createConversation from httpService');

    return this.httpClient
      .post<ResponseCoversationBody>(
        this.url + this.postPeopleConversationPath,
        body,
        {
          headers,
        }
      )
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.handleHttpError<ResponseCoversationBody>(err)
        )
      );
  }
}
