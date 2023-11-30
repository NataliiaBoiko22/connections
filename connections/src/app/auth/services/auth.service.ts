import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SignUpBody } from 'src/app/shared/models/auth-models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public token = '';
  isSingInFromStorage = !!localStorage.getItem('token');
  isSingIn$ = new BehaviorSubject(this.isSingInFromStorage);
  // constructor(private httpResponse: HttpService,
  //  ) { }

  signUp(data: SignUpBody): void {
    // this.httpResponse.signUp(data).subscribe((resp) => {
    //   if (typeof resp === 'object' && '_id' in resp) {
    //     localStorage.setItem('userId', resp._id);
    //   }

  }
  // )}
}
