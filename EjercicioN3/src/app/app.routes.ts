import { Routes } from '@angular/router';
import { BienvenidoComponent } from './models/bienvenido/bienvenido.component';
import { ErrorComponent } from './models/error/error.component';
import { LoginComponent } from './models/login/login.component';

export const routes: Routes = [
     // Si le ponemos 'prefix' nos va a arrojar un error en la consola de redireccion infinita
     { path: '', redirectTo: '/bienvenido', pathMatch: "full" },
     { path: 'bienvenido', component: BienvenidoComponent },
     { path: 'error', component: ErrorComponent },
     {path: 'login', component: LoginComponent,},
     // La ruta comodin debe ir siempre al final
     { path: '**', component: ErrorComponent },
];