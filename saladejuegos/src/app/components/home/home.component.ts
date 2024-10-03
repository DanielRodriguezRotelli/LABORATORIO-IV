import { Component } from '@angular/core';
import { User } from '../../models/user';
import { Router, RouterLink } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { Auth, signOut } from '@angular/fire/auth';
import { LoginComponent } from '../login/login.component';
import { HangmanComponent } from '../../modules/games/hangman/hangman.component';
import { QuestionsComponent } from '../../modules/games/questions/questions.component';
import { AboutmeComponent } from '../aboutme/aboutme.component';
import { GreaterorlessComponent } from '../../modules/games/greaterorless/greaterorless.component';
import { GamesModule } from '../../modules/games/games.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GamesModule, RouterLink],
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
    this.router.navigate(['/games/questions']);
  }

  goToGreater():void{
    this.router.navigate(['/games/greater']);
  }

  goToHangman():void{
    this.router.navigate(['/games/hangman']);
  }

  goToBattleship():void{
    this.router.navigate(['/games/battleship']);
  }
}
