import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  TuiAlertModule,
  TuiButtonModule,
  TuiDialogModule,
  TuiLabelModule,
  TuiRootModule,
} from '@taiga-ui/core';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import { TuiThemeNightModule, TuiModeModule } from '@taiga-ui/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SignUpBody } from 'src/app/shared/models/auth-models';
import { NotificationComponent } from 'src/app/shared/components/notification/notification.component';
import { TuiErrorModule } from '@taiga-ui/core';
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputPasswordModule,
} from '@taiga-ui/kit';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit';
import {
  interval,
  map,
  Observable,
  of,
  scan,
  startWith,
  switchMap,
} from 'rxjs';
import { tuiIsFalsy } from '@taiga-ui/cdk';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { TuiCardModule } from '@taiga-ui/experimental';
import { Store } from '@ngrx/store';
import { selectEmailError } from 'src/app/Store/selectors/selectors';
import { setEmailError } from 'src/app/Store/actions/actions';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TuiRootModule,
    TuiDialogModule,
    TuiInputModule,
    TuiCardModule,
    TuiLabelModule,
    TuiInputPasswordModule,
    TuiAlertModule,
    TuiBlockStatusModule,
    TuiButtonModule,
    TuiThemeNightModule,
    TuiModeModule,
    NotificationComponent,
    FormsModule,
    ReactiveFormsModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiTextfieldControllerModule,
  ],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: 'Enter this!',
        email: 'Enter a valid email',
        password: interval(2000).pipe(
          scan(tuiIsFalsy, false),
          map((val) =>
            val
              ? 'Fix please'
              : 'minimum 8 symbols, 1 capital letter, 1 digit and 1 special symbol'
          ),
          startWith('Min number 3')
        ),
      },
    },
  ],
})
export class SignupComponent {
  isRegistrationButtonDisabled = false;
  emailError$ = this.store.select(selectEmailError);
  patterns = {
    PATTERN_NAME: /^[a-zA-Z\s\d\p{L}]{1,40}$/,
    PATTERN_PASSWORD:
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
  };
  authForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(this.patterns.PATTERN_NAME),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(this.patterns.PATTERN_PASSWORD),
    ]),
  });

  controlEmail = this.authForm.get('email') as FormControl;

  constructor(
    private authService: AuthService,
    private store: Store,
    private router: Router
  ) {
    this.authForm.valueChanges.subscribe(() => {
      this.authForm.markAsTouched();
    });
  }

  onSingUpButton(): void {
    if (this.authForm.invalid) {
      return;
    }
    const data = this.authForm.value as SignUpBody;
    this.authService.signUp(data);
  }
  onEmailInputChange(): void {
    this.controlEmail.setErrors(null);
    this.store.dispatch(setEmailError({ emailError: false }));
  }
  getError(): Observable<string | null> {
    return this.emailError$.pipe(
      switchMap((emailError) => {
        const fieldError = this.controlEmail?.getError('email');
        return of(emailError ? emailError : fieldError ? fieldError : null);
      })
    ) as Observable<string | null>;
  }
  cancelButtonClick(): void {
    this.router.navigate(['/signin']);
  }
}
