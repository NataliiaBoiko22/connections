import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

import { HttpErrorService } from './http-error.service';

import {
  PeopleConversationsListResponseBody,
  PeopleListResponseBody,
} from 'src/app/shared/models/people-model';

import { RequestHeaders } from 'src/app/shared/models/http-model';
import {
  PeopleConversationRequestBody,
  PeopleConversationResonseBody,
} from 'src/app/shared/models/people-messages-model';
@Injectable({
  providedIn: 'root',
})
export class HttpPeopleService {
  // url = ' https://tasks.app.rs.school/angular';
  url = 'https://connectionsback-whir.onrender.com';

  getPeopleListPath = '/users';
  getPeopleConversationsListPath = '/conversations/list';
  postPeopleConversationPath = '/conversations/create';
  constructor(
    private httpClient: HttpClient,
    private httpErrorService: HttpErrorService
  ) {}

  public getPeopleList({
    headers,
  }: RequestHeaders): Observable<PeopleListResponseBody> {
    return this.httpClient
      .get<PeopleListResponseBody>(this.url + this.getPeopleListPath, {
        headers,
      })
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.httpErrorService.handleHttpError<PeopleListResponseBody>(err)
        )
      );
  }

  public getPeopleConversationsList({
    headers,
  }: RequestHeaders): Observable<PeopleConversationsListResponseBody> {
    return this.httpClient
      .get<PeopleConversationsListResponseBody>(
        this.url + this.getPeopleConversationsListPath,
        {
          headers,
        }
      )
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.httpErrorService.handleHttpError<PeopleConversationsListResponseBody>(
            err
          )
        )
      );
  }

  public createPeopleConversation(
    body: PeopleConversationRequestBody,
    { headers }: RequestHeaders
  ): Observable<PeopleConversationResonseBody> {
    return this.httpClient
      .post<PeopleConversationResonseBody>(
        this.url + this.postPeopleConversationPath,
        body,
        {
          headers,
        }
      )
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.httpErrorService.handleHttpError<PeopleConversationResonseBody>(
            err
          )
        )
      );
  }
}
