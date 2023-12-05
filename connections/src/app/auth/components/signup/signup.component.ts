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
  BehaviorSubject,
  combineLatest,
  forkJoin,
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
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
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
        // maxlength: ({requiredLength}: {requiredLength: string}) =>
        //     `Maximum length — ${requiredLength}`,
        // minlength: ({requiredLength}: {requiredLength: string}) =>
        //     of(`Minimum length — ${requiredLength}`),
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
    PATTERN_NAME: /^[a-zA-Z\s]{1,40}$/,
    PATTERN_PASSWORD:
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
  };
  authForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(this.patterns.PATTERN_PASSWORD),
    ]),
  });

  // controlName = this.authForm.get('name') as FormControl;

  controlEmail = this.authForm.get('email') as FormControl;

  // controlPassword = this.authForm.get('password') as FormControl;

  constructor(private authService: AuthService, private store: Store) {
    this.authForm.valueChanges.subscribe(() => {
      this.authForm.markAsTouched();
    });
  }

  onSingUpButton(): void {
    // this.isRegistrationButtonDisabled = true;
    // this.emailError = false;
    if (this.authForm.invalid) {
      return;
    }
    const data = this.authForm.value as SignUpBody;
    this.authService.signUp(data);
  }
  onEmailInputChange(): void {
    // Сбросить ошибки валидации при изменении значения поля email
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
}
