import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  EditProfileBody,
  ProfileResponseBody,
} from 'src/app/shared/models/profile-model';
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
import { NotificationComponent } from 'src/app/shared/components/notification/notification.component';
import { TuiErrorModule } from '@taiga-ui/core';
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputPasswordModule,
} from '@taiga-ui/kit';
import { Observable, take } from 'rxjs';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { TuiCardModule } from '@taiga-ui/experimental';
import { select, Store } from '@ngrx/store';
import { deleteLogin, updateName } from 'src/app/Store/actions/actions';
import { selectProfileData } from 'src/app/Store/selectors/selectors';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
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
    TuiDialogModule,
  ],
})
export class ProfileComponent {
  public profileData$!: Observable<ProfileResponseBody>;
  isEditing = false;
  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.store.pipe(select(selectProfileData), take(1)).subscribe((data) => {
      console.log('data from selectProfileData', data);
      const isProfileDataEmpty = Object.values(data).every((value) => {
        if (value && typeof value === 'object') {
          return Object.entries(value).every(([key, innerValue]) => {
            return key === 'S' && innerValue === '';
          });
        }
        return false;
      });
      if (isProfileDataEmpty) {
        console.log('if (isProfileDataEmpty) ');
        this.store.dispatch({ type: '[Profile] Set Profile Data' });
      }
    });

    this.profileData$ = this.store.select(selectProfileData);
  }

  onEditClick(): void {
    this.isEditing = true;
  }

  patterns = {
    PATTERN_NAME: /^[a-zA-Z\s\d\p{L}]{1,40}$/,
  };
  editProfileForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(this.patterns.PATTERN_NAME),
    ]),
  });

  onCancelButton(): void {
    this.isEditing = false;
  }
  onSaveButton(): void {
    if (this.editProfileForm.invalid) {
      return;
    }
    const data = this.editProfileForm.value as EditProfileBody;
    this.store.dispatch(updateName(data));
    this.isEditing = false;
  }
  onLogoutButton() {
    this.store.dispatch(deleteLogin());

    localStorage.clear();
    sessionStorage.clear();
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }

    this.router.navigate(['signin']);
  }
}
