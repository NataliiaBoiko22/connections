import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiAlertModule, TuiDialogModule, TuiRootModule } from '@taiga-ui/core';
import {TuiBlockStatusModule} from '@taiga-ui/layout';
import {TuiThemeNightModule, TuiModeModule} from '@taiga-ui/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SignUpBody } from 'src/app/shared/models/auth-models';
import { NotificationComponent } from 'src/app/shared/components/notification/notification.component';
import {TuiErrorModule} from '@taiga-ui/core';
import {TuiFieldErrorPipeModule} from '@taiga-ui/kit';
import {TUI_VALIDATION_ERRORS} from '@taiga-ui/kit';
import { interval, map, of, scan, startWith } from 'rxjs';
import {tuiIsFalsy, TuiValidationError} from '@taiga-ui/cdk';
import {TuiTextfieldControllerModule} from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TuiRootModule, TuiDialogModule, TuiAlertModule, TuiBlockStatusModule,
    TuiThemeNightModule,
    TuiModeModule, NotificationComponent, FormsModule,
    ReactiveFormsModule, TuiErrorModule, TuiFieldErrorPipeModule, TuiTextfieldControllerModule],
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
                    map(val => (val ? 'Fix please' : 'minimum 8 symbols, 1 capital letter, 1 digit and 1 special symbol')),
                    startWith('Min number 3'),
                ),
            },
        },
    ],

})
export class SignupComponent {
  
  patterns = {
    MIN_LENGTH: 4,
    MAX_LENGTH: 20,
    PATTERN_NAME: /^[a-z0-9]+$/,
    PATTERN_PASSWORD:
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
  };
  authForm = new FormGroup({
    name: new FormControl('', [ Validators.required ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(this.patterns.MIN_LENGTH),
      Validators.maxLength(this.patterns.MAX_LENGTH),
      Validators.pattern(this.patterns.PATTERN_PASSWORD),
    ]),
  });

  controlName = this.authForm.get('name') as FormControl;

  controlEmail = this.authForm.get('email') as FormControl;

  controlPassword = this.authForm.get('password') as FormControl;

  // constructor(private auth: AuthService) {}
  constructor(private auth: AuthService) {
    this.authForm.valueChanges.subscribe(() => {
        this.authForm.markAsTouched();
    });
}
//  error = new TuiValidationError('An error');
 
  onSingUpButton(): void {
    if (this.authForm.invalid) {
      return;
    }
    const data = this.authForm.value as SignUpBody;
    this.auth.signUp(data);
  }

}
