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

  ResponseGroupID,
} from 'src/app/shared/models/groups-model';

import {
  GroupMessagesRequestBody,
  GroupMessagesResponseBody,
} from 'src/app/shared/models/group-messages-model';
import {
  RequestHeaders,
  ResponseSinceTimestamp,
} from 'src/app/shared/models/http-model';

@Injectable({
  providedIn: 'root',
})
export class HttpGroupDialogService {
  url = ' https://tasks.app.rs.school/angular';

  getGroupMessagesPath = '/groups/read';
  postGroupMessagesPath = '/groups/append';
  constructor(
    private httpClient: HttpClient,
    private httpErrorService: HttpErrorService
  ) {}

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

    return this.httpClient
      .get<GroupMessagesResponseBody>(apiUrl, {
        headers,
      })
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.httpErrorService.handleHttpError<GroupMessagesResponseBody>(err)
        )
      );
  }

  public sendGroupMessages(
    body: GroupMessagesRequestBody,
    headers: RequestHeaders
  ) {

    return this.httpClient
      .post(this.url + this.postGroupMessagesPath, body, headers)
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.httpErrorService.handleHttpError(err)
        )
      );
  }
}
