import {  Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: 'signin',
    loadComponent: () => import('./auth/components/signin/signin.component').then((m) => m.SigninComponent),
  },


];

