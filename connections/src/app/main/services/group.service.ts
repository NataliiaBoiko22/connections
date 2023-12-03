import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpService } from 'src/app/core/services/http.service';
import { GroupListResponseBody } from 'src/app/shared/models/groups-model';
import { setGroupListData } from 'src/app/Store/actions/actions';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  userId = localStorage.getItem('uid') as string;
  userEmail = localStorage.getItem('email') as string;
  authToken = localStorage.getItem('token') as string;

  constructor(private httpService: HttpService, private store: Store) {}

  fetchGroups(): void {
    const headers = {
      'rs-uid': this.userId,
      'rs-email': this.userEmail,
      Authorization: `Bearer ${this.authToken}`,
    };
    this.httpService.getGroupList({ headers }).subscribe({
      next: (data: GroupListResponseBody) => {
        this.store.dispatch(setGroupListData({ data }));
      },
      error: (error: Error) => {
        console.error('Failed to fetch groups', error);
      },
    });
  }

}
