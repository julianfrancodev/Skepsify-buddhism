import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'onboarding',
    loadChildren: () =>
      import('./onboarding/onboarding.routes').then((m) => m.onboardingRoutes),
  },
  {
    path: '',
    redirectTo: 'onboarding',
    pathMatch: 'full',
  },

];
