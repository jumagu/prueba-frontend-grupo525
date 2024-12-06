import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'contact',
    loadComponent: () =>
      import('@/landing/pages/contact/contact-page.component'),
  },
  {
    path: 'users',
    loadComponent: () => import('@/admin/pages/user/user-page.component'),
  },
  {
    path: '**',
    redirectTo: 'contact',
  },
];
