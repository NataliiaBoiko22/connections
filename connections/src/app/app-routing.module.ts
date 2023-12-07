import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: 'signup',
    loadComponent: () =>
      import('./auth/components/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },

  {
    path: 'signin',
    loadComponent: () =>
      import('./auth/components/signin/signin.component').then(
        (m) => m.SigninComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./core/profile/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./main/pages/main-page/main-page.component').then(
        (m) => m.MainPageComponent
      ),
  },
  {
    path: 'group/:groupID',
    loadComponent: () =>
      import('./main/components/group-dialog/group-dialog.component').then(
        (m) => m.GroupDialogComponent
      ),
  },
];
