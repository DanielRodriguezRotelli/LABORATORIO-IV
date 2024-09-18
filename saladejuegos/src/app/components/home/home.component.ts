import { Component } from '@angular/core';
import { User } from '../../models/user';
import { Router, RouterLink } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { Auth, signOut } from '@angular/fire/auth';
import { LoginComponent } from '../login/login.component';
import { HangmanComponent } from '../hangman/hangman.component';
import { QuestionsComponent } from '../questions/questions.component';
import { AboutmeComponent } from '../aboutme/aboutme.component';
import { GreaterorlessComponent } from '../greaterorless/greaterorless.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, AboutmeComponent, HangmanComponent, GreaterorlessComponent, QuestionsComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  title1: string = "MULTI";
  title2: string = "GAMES";
  flagError: boolean = false;
  notification: string = "";

  constructor(private router: Router, 
              private firestore: Firestore,
              public auth: Auth) {}

  logout(){
    signOut(this.auth).then(() =>{
      this.flagError = false;
      this.goToLogin();
    }).catch((e) => {

      this.flagError = true;
      console.log(e);

      switch(e.code) {
        case "auth/network-request-failed":
          this.notification = "Error de red. Verifica tu conexión a internet.";
          break;
        case "auth/internal-error":
          this.notification = "Ocurrió un error interno. Intenta nuevamente más tarde.";
          break;
        default:
          this.notification = "Error desconocido: " + e.message;
          break;
      }
    })
  }

  goToLogin():void{
    this.router.navigate(['/login']);
  }

  goToQuestions():void{
    this.router.navigate(['/questions']);
  }

  goToGreater():void{
    this.router.navigate(['/greater']);
  }

  goToHangman():void{
    this.router.navigate(['/hangman']);
  }

  goToPropio():void{
    this.router.navigate(['/propio']);
  }
}
