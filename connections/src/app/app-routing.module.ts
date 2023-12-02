import {  Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: 'signup',
    loadComponent: () => import('./auth/components/signup/signup.component').then((m) => m.SignupComponent),
  },

  {
    path: 'signin',
    loadComponent: () => import('./auth/components/signin/signin.component').then((m) => m.SigninComponent),
  },


];

