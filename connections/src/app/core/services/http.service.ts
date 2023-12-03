import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, EMPTY, Observable, switchMap } from 'rxjs';
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
import { AuthService } from 'src/app/auth/services/auth.service';
import { Store } from '@ngrx/store';
import { setEmailError } from 'src/app/Store/actions/actions';
import { GroupListResponseBody } from 'src/app/shared/models/groups-model';
import { PeopleListResponseBody } from 'src/app/shared/models/people-models';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  url = ' https://tasks.app.rs.school/angular';

  signUpPath = '/registration';

  singInPath = '/login';

  profilePath = '/profile';

  deleteProfilePath = '/logout';

  groupsListPath = '/groups/list';

  peopleListPath = '/users';

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
    return this.httpClient.get<ProfileResponseBody>(
      this.url + this.profilePath,
      {
        headers,
      }
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
      .put<SignUpResponse>(this.url + this.profilePath, params, {
        headers,
      })
      .pipe(catchError(async (err) => this.httpError.catchErrors(err)));
  }

  public deleteLogin({ headers }: { headers: { [key: string]: string } }) {
    return this.httpClient
      .delete(this.url + this.deleteProfilePath, {
        headers,
      })
      .pipe(catchError(async (err) => this.httpError.catchErrors(err)));
  }

  getGroupList({
    headers,
  }: {
    headers: { [key: string]: string };
  }): Observable<GroupListResponseBody> {
    console.log('getGroupList from httpService');
    return this.httpClient.get<GroupListResponseBody>(
      this.url + this.groupsListPath,
      {
        headers,
      }
    );
  }

  getPeopleList({
    headers,
  }: {
    headers: { [key: string]: string };
  }): Observable<PeopleListResponseBody> {
    console.log('getPeopleList from httpService');

    return this.httpClient.get<PeopleListResponseBody>(
      this.url + this.peopleListPath,
      {
        headers,
      }
    );
  }
}
