import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
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

import { RequestHeaders } from 'src/app/shared/models/http-model';

@Injectable({
  providedIn: 'root',
})
export class HttpAuthService {
  url = ' https://tasks.app.rs.school/angular';

  signUpPath = '/registration';
  singInPath = '/login';
  getProfilePath = '/profile';
  deleteProfilePath = '/logout';

  constructor(
    private httpClient: HttpClient,
    private httpErrorService: HttpErrorService
  ) {}

  public signUp(params: SignUpBody) {
    return this.httpClient
      .post<SignUpResponse>(this.url + this.signUpPath, params)
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.httpErrorService.handleHttpError<SignUpResponse>(err)
        )
      );
  }

  public singIn(params: SignInBody): Observable<SignInResponseBody> {
    return this.httpClient
      .post<SignInResponseBody>(this.url + this.singInPath, params)
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.httpErrorService.handleHttpError<SignInResponseBody>(err)
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
          this.httpErrorService.handleHttpError<ProfileResponseBody>(err)
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
          this.httpErrorService.handleHttpError<SignUpResponse>(err)
        )
      );
  }

  public deleteLogin({ headers }: RequestHeaders) {
    console.log('deleteLogin from httpService');

    return this.httpClient
      .delete(this.url + this.deleteProfilePath, {
        headers,
      })
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.httpErrorService.handleHttpError(err)
        )
      );
  }
}
