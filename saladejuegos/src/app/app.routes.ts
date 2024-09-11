import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { QuiensoyComponent } from './components/quiensoy/quiensoy.component';

export const routes: Routes = [
    // Si le ponemos 'prefix' nos va a arrojar un error en la consola de redireccion infinita
    { path: '', redirectTo: '/login', pathMatch: "full" },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'quiensoy', component: QuiensoyComponent },
    { path: 'registrar', component: RegistrarComponent },
    // La ruta comodin debe ir siempre al final
    { path: '**', component: LoginComponent },
];
