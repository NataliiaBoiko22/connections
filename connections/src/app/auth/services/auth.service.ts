import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpAuthService } from 'src/app/core/services/auth-http.service';
import { SignInBody, SignUpBody } from 'src/app/shared/models/auth-models';
import {
  NotificationService,
  toastTypes,
} from 'src/app/shared/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public token = '';
  isSingInFromStorage = !!localStorage.getItem('token');
  isSingIn$ = new BehaviorSubject(this.isSingInFromStorage);

  constructor(
    private httpService: HttpAuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  logged(): boolean {
    return !!localStorage.getItem('token');
  }

  signUp(data: SignUpBody): void {
    this.httpService.signUp(data).subscribe((resp) => {
      if (resp === null) {
        this.router.navigate(['signin']);
        this.notificationService.initiate({
          title: 'Success!',
          content: `Your account ${data.email} created successfully!`,
          type: toastTypes.success,
        });
      }
    });
  }

  singIn(data: SignInBody): void {
    this.httpService.singIn(data).subscribe((respSingIn) => {
      if (typeof respSingIn === 'object' && 'token' in respSingIn) {
        this.isSingIn$.next(true);
        localStorage.setItem('token', respSingIn.token);
        localStorage.setItem('uid', respSingIn.uid);
        localStorage.setItem('email', data.email);
        this.router.navigate(['']);
        this.notificationService.initiate({
          title: `Welcome!`,
          content: `You enter to Connections successfully!`,
          type: toastTypes.success,
        });
      }
    });
  }
}
