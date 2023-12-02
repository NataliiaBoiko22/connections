import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, Observable, switchMap } from 'rxjs';
import {
  SignInBody,
  SignInResponseBody,
  SignUpBody,
  SignUpResponse,
} from 'src/app/shared/models/auth-models';
import { HttpErrorService } from './http-error.service';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  url = ' https://tasks.app.rs.school/angular';

  signUpPath = '/registration';

  singInPath = '/login';

  constructor(
    private httpClient: HttpClient,
    private httpError: HttpErrorService
  ) {}

  public signUp(params: SignUpBody): Observable<SignUpResponse> {
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
}
