import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { adminGuard } from './guards/admin.guard';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';

export const routes: Routes = [

    { path: '', redirectTo: 'welcome', pathMatch: 'full' },

    { path: 'welcome', component: WelcomeComponent},

    { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)},

    { path: 'registro', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)},

    { path: 'terms', loadComponent: () => import('./components/terms/terms.component').then(m => m.TermsComponent),
      canDeactivate: [CanDeactivateGuard]
    },
    {
      path: 'chofer/alta',
      loadChildren: () =>
        import('./driver/registration-driver/registration-driver.module').then(
          (m) => m.RegistrationDriverModule
        ),
        canActivate: [AuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo('login') }
    },
    {
      path: 'chofer/detalle',
      loadChildren: () =>
        import('./driver/detail-driver/detail-driver.module').then(
          (m) => m.DetailDriverModule
        ),
        canActivate: [AuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo('login') }
    },
    {
      path: 'vehiculo',
      loadChildren: () =>
        import('./vehicle/vehicle.module').then(
          (m) => m.VehicleModule
        ),
        canActivate: [AuthGuard, adminGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo('login') }
    },

    { path: '**', loadComponent: () => import('./components/error/error.component').then((m) => m.ErrorComponent)},
];
