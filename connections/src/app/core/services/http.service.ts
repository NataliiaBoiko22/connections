import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, EMPTY, Observable, switchMap, throwError } from 'rxjs';
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

  getProfileData({
    headers,
  }: {
    headers: { [key: string]: string };
  }): Observable<ProfileResponseBody> {
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

  public editProfile(
    {
      headers,
    }: {
      headers: { [key: string]: string };
    },
    params: EditProfileBody
  ) {
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

  public deleteLogin({ headers }: { headers: { [key: string]: string } }) {
    return this.httpClient
      .delete(this.url + this.deleteProfilePath, {
        headers,
      })
      .pipe(catchError((err: HttpErrorResponse) => this.handleHttpError(err)));
  }

  public getGroupList({
    headers,
  }: {
    headers: { [key: string]: string };
  }): Observable<GroupListResponseBody> {
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
  }: {
    headers: { [key: string]: string };
  }): Observable<PeopleListResponseBody> {
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
    {
      headers,
    }: {
      headers: { [key: string]: string };
    },
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

  public deleteGroup(
    { headers }: { headers: { [key: string]: string } },
    groupID: ResponseGroupID
  ) {
    const params = new HttpParams().set('groupID', groupID.groupID);
    return this.httpClient
      .delete(this.url + this.deleteGroupPath, { headers, params })
      .pipe(catchError((err: any) => this.handleHttpError(err)));
  }
}
