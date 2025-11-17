import { Routes } from "@angular/router";
import { OnboardingPage } from "./onboarding.page";



export const onboardingRoutes: Routes = [
  {
    path: '',
    component: OnboardingPage,
    children:[
      {
        path: 'welcome',
        loadComponent: () =>
          import('./welcome/welcome.page').then((m) => m.WelcomePage),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./register/register.page').then((m) => m.RegisterPage),
      },
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full',
      }
    ]
  }
]
