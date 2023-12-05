import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpService } from 'src/app/core/services/http.service';
import { PeopleListResponseBody } from 'src/app/shared/models/people-models';
import { setPeopleListData } from 'src/app/Store/actions/actions';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  userId = localStorage.getItem('uid') as string;
  userEmail = localStorage.getItem('email') as string;
  authToken = localStorage.getItem('token') as string;

  constructor(private httpService: HttpService, private store: Store) {}

  // fetchPeople(): void {
  //   const headers = {
  //     'rs-uid': this.userId,
  //     'rs-email': this.userEmail,
  //     Authorization: `Bearer ${this.authToken}`,
  //   };
  //   this.httpService.getPeopleList({ headers }).subscribe({
  //     next: (data: PeopleListResponseBody) => {
  //       this.store.dispatch(setPeopleListData({ data }));
  //     },
  //     error: (error: Error) => {
  //       console.error('Failed to fetch groups', error);
  //     },
  //   });
  // }
}
