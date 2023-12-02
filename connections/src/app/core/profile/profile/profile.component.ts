import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  EditProfileBody,
  ProfileResponseBody,
} from 'src/app/shared/models/profile-models';
import { HttpService } from '../../services/http.service';
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
import { AuthService } from '../../../auth/services/auth.service';
import { SignUpBody } from 'src/app/shared/models/auth-models';
import { NotificationComponent } from 'src/app/shared/components/notification/notification.component';
import { TuiErrorModule } from '@taiga-ui/core';
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputPasswordModule,
} from '@taiga-ui/kit';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit';
import { interval, map, Observable, scan, startWith } from 'rxjs';
import { tuiIsFalsy } from '@taiga-ui/cdk';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { TuiCardModule } from '@taiga-ui/experimental';
import { select, Store } from '@ngrx/store';
import { setProfileData } from 'src/app/Store/actions/actions';
import { selectProfileData } from 'src/app/Store/selectors/selectors';
import { ProfileService } from '../../services/profile.service';
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
  userId = localStorage.getItem('uid') as string;
  userEmail = localStorage.getItem('email') as string;
  authToken = localStorage.getItem('token') as string;
  constructor(
    private store: Store,
    private profileService: ProfileService,
    private router: Router
  ) {
    if (this.userId && this.userEmail && this.authToken) {
      this.profileService.getProfile(
        this.userId,
        this.userEmail,
        this.authToken
      );
      this.profileData$ = this.store
        .select(selectProfileData)
        .pipe(map((data) => this.profileService.transformProfileData(data)));
    } else {
      console.error('User data not found in local storage');
    }
  }

  ngOnInit(): void {}

  onEditClick(): void {
    this.isEditing = true;
  }

  patterns = {
    PATTERN_NAME: /^[a-z0-9]+$/,
  };
  editProfileForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  onCancelButton(): void {
    this.isEditing = false;
  }
  onSaveButton(): void {
    if (this.editProfileForm.invalid) {
      return;
    }
    const data = this.editProfileForm.value as EditProfileBody;
    this.profileService.editUserProfile(
      this.userId,
      this.userEmail,
      this.authToken,
      data
    );
    this.isEditing = false;
  }
  onLogoutButton() {
    this.profileService.logout(this.userId, this.userEmail, this.authToken);
    this.router.navigate(['signin']);
  }
}
