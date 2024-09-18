import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AboutmeComponent } from './components/aboutme/aboutme.component';
import { RegisterComponent } from './components/register/register.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { HangmanComponent } from './components/hangman/hangman.component';
import { GreaterorlessComponent } from './components/greaterorless/greaterorless.component';

export const routes: Routes = [
    // Si le ponemos 'prefix' nos va a arrojar un error en la consola de redireccion infinita
    { path: '', redirectTo: '/home', pathMatch: "full" },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'quiensoy', component: AboutmeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'questions', component: QuestionsComponent },
    { path: 'hangman', component: HangmanComponent },
    { path: 'greater', component: GreaterorlessComponent },
    // La ruta comodin debe ir siempre al final
    { path: '**', component: HomeComponent },
];
