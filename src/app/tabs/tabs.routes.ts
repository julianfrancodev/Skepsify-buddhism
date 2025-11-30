import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { authGuard } from '../core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    canActivate: [authGuard], // Proteger todas las rutas de tabs
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab2/counter/:id',
        loadComponent: () =>
          import('../tab2/pages/details-counter-ngondro/details-counter-ngondro.component').then((m) => m.DetailsCounterNgondroComponent),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'tab3/basic-timer',
        loadComponent: () =>
          import('../tab3/pages/page-basic-timer/page-basic-timer.component').then((m) => m.PageBasicTimerComponent),
      },
      {
        path: 'tab3/basic-search',
        loadComponent: () =>
          import('../tab3/pages/page-basic-search/page-basic-search.component').then((m) => m.PageBasicSearchComponent),
      },
      {
        path: 'tab4',
        loadComponent: () =>
          import('../tab4/tab4.page').then((m) => m.Tab4Page),
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];
