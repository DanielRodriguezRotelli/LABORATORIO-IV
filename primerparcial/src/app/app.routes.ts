import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [

    { path: '', redirectTo: 'welcome', pathMatch: 'full' },

    { path: 'welcome', component: WelcomeComponent},

    { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)},

    {
      path: 'repartidor/alta',
      loadChildren: () =>
        import('./dealer/registration-dealer/registration-dealer.module').then(
          (m) => m.RegistrationDealerModule
        ),
        canActivate: [AuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo('login') }
      },
      {
        path: 'repartidor/detalle',
        loadChildren: () =>
          import('./dealer/detail-dealer/detail-dealer.module').then(
            (m) => m.DetailDealerModule
          ),
          canActivate: [AuthGuard],
          data: { authGuardPipe: () => redirectUnauthorizedTo('login') }
      },
      {
        path: 'helados',
        loadChildren: () =>
          import('./ice-cream/ice-cream.module').then(
            (m) => m.IceCreamModule
          ),
          canActivate: [AuthGuard, adminGuard],
          data: { authGuardPipe: () => redirectUnauthorizedTo('login') }
      },

    { path: '**', loadComponent: () => import('./components/error/error.component').then((m) => m.ErrorComponent)},
];
