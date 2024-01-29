import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

import { HttpErrorService } from './http-error.service';

import {
  GroupListResponseBody,
  RequestGroupItem,
  ResponseGroupID,
} from 'src/app/shared/models/groups-model';

import { RequestHeaders } from 'src/app/shared/models/http-model';

@Injectable({
  providedIn: 'root',
})
export class HttpGroupService {
  // url = ' https://tasks.app.rs.school/angular';
  url = 'https://connectionsback-whir.onrender.com';

  getGroupsListPath = '/groups/list';
  postGroupsPath = '/groups/create';
  deleteGroupPath = '/groups/delete';
  constructor(
    private httpClient: HttpClient,
    private httpErrorService: HttpErrorService
  ) {}

  public getGroupList({
    headers,
  }: RequestHeaders): Observable<GroupListResponseBody> {
    return this.httpClient
      .get<GroupListResponseBody>(this.url + this.getGroupsListPath, {
        headers,
      })
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.httpErrorService.handleHttpError<GroupListResponseBody>(err)
        )
      );
  }

  public createNewGroup(
    { headers }: RequestHeaders,
    params: RequestGroupItem
  ): Observable<ResponseGroupID> {

    return this.httpClient
      .post<ResponseGroupID>(this.url + this.postGroupsPath, params, {
        headers,
      })
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.httpErrorService.handleHttpError<ResponseGroupID>(err)
        )
      );
  }

  public deleteGroup({ headers }: RequestHeaders, groupID: ResponseGroupID) {
    const params = new HttpParams().set('groupID', groupID.groupID);
    return this.httpClient
      .delete(this.url + this.deleteGroupPath, { headers, params })
      .pipe(
        catchError((err: HttpErrorResponse) =>
          this.httpErrorService.handleHttpError(err)
        )
      );
  }
}
