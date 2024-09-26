import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AboutmeComponent } from './components/aboutme/aboutme.component';
import { RegisterComponent } from './components/register/register.component';
import { QuestionsComponent } from './modules/games/questions/questions.component';
import { HangmanComponent } from './modules/games/hangman/hangman.component';
import { GreaterorlessComponent } from './modules/games/greaterorless/greaterorless.component';

export const routes: Routes = [
    // Si le ponemos 'prefix' nos va a arrojar un error en la consola de redireccion infinita
    { path: '', redirectTo: '/home', pathMatch: "full" },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'quiensoy', component: AboutmeComponent },
    { path: 'register', component: RegisterComponent },
    

    { path: 'games', loadChildren: () => import('./modules/games/games.module').then(m => m.GamesModule)},

    //{ path: 'questions', component: QuestionsComponent },
    //{ path: 'hangman', component: HangmanComponent },
    //{ path: 'greater', component: GreaterorlessComponent },
    { path: '**', component: HomeComponent }
    // La ruta comodin debe ir siempre al final
    

    /*
    { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)},
    { path: 'quiensoy', loadComponent: () => import('./components/aboutme/aboutme.component').then(m => m.AboutmeComponent)},
    { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
    { path: 'questions',loadComponent: () => import('./components/questions/questions.component').then(m => m.QuestionsComponent)},
    { path: 'hangman', loadComponent: () => import('./components/hangman/hangman.component').then(m => m.HangmanComponent)},
    { path: 'greater', loadComponent: () => import('./components/greaterorless/greaterorless.component').then(m => m.GreaterorlessComponent)},
    */
];
