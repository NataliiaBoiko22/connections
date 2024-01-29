import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import {
  catchError,
} from 'rxjs';
import { HttpErrorService } from './http-error.service';
import {
  RequestHeaders,
  ResponseSinceTimestamp,
} from 'src/app/shared/models/http-model';
import {
  PeopleMessagesRequestBody,
  PeopleMessagesResponseBody,
} from 'src/app/shared/models/people-messages-model';
@Injectable({
  providedIn: 'root',
})
export class HttpPeopleConversationService {
  // url = ' https://tasks.app.rs.school/angular';
  url = 'https://connectionsback-whir.onrender.com';

  getPeopleMessagesPath = '/conversations/read';
  postPeopleMessagesPath = '/conversations/append';
  deletePeopleConversationPath = '/conversations/delete';
  constructor(
    private httpClient: HttpClient,
    private httpErrorService: HttpErrorService
  ) {}

  public getPeopleMessages(
    { headers }: RequestHeaders,
    conversationID: PeopleMessagesRequestBody,
    since?: ResponseSinceTimestamp
  ) {
    let params = new HttpParams().set(
      'conversationID',
      conversationID.conversationID
    );

    if (since?.since !== undefined) {
      params = params.set('since', String(since.since));
    }

    const apiUrl =
      this.url + this.getPeopleMessagesPath + '?' + params.toString();

    return this.httpClient
      .get<PeopleMessagesResponseBody>(apiUrl, {
        headers,
      })
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.httpErrorService.handleHttpError<PeopleMessagesResponseBody>(err)
        )
      );
  }
  public sendPeopleMessages(
    body: PeopleMessagesRequestBody,
    headers: RequestHeaders
  ) {
    return this.httpClient
      .post(this.url + this.postPeopleMessagesPath, body, headers)
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.httpErrorService.handleHttpError(err)
        )
      );
  }

  public deletePeopleConversation(
    { headers }: RequestHeaders,
    conversationID: PeopleMessagesRequestBody
  ) {
    const params = new HttpParams().set(
      'conversationID',
      conversationID.conversationID
    );
    return this.httpClient
      .delete(this.url + this.deletePeopleConversationPath, { headers, params })
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.httpErrorService.handleHttpError(err)
        )
      );
  }
}
