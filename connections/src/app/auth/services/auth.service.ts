import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TuiDialogService } from '@taiga-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { SignInBody, SignUpBody } from 'src/app/shared/models/auth-models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public token = '';
  isSingInFromStorage = !!localStorage.getItem('token');
  isSingIn$ = new BehaviorSubject(this.isSingInFromStorage);

  constructor(
    private httpService: HttpService,
    private router: Router,
    private dialogService: TuiDialogService
  ) {}

  signUp(data: SignUpBody): void {
    this.httpService.signUp(data).subscribe((resp) => {
      if (resp === null) {
        this.router.navigate(['signin']);
        this.dialogService
          .open('Account Created Successfully!', {
            label: 'Success',
            size: 's',
          })
          .subscribe();
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
        this.dialogService
          .open('Welcome to Connections', {
            label: 'Success',
            size: 's',
          })
          .subscribe();
      }
    });
  }
}
