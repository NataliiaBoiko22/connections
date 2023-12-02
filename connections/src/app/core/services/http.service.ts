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
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  url = ' https://tasks.app.rs.school/angular';

  signUpPath = '/registration';

  singInPath = '/login';

  profilePath = '/profile';

  constructor(
    private httpClient: HttpClient,
    private httpError: HttpErrorService
  ) {}

  public signUp(params: SignUpBody) {
    return this.httpClient
      .post(this.url + this.signUpPath, params)
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.handleHttpError<SignUpResponse>(err)
        )
      );
  }

  private handleHttpError<T>(err: HttpErrorResponse): Observable<T> {
    console.log('err', err);
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
}
