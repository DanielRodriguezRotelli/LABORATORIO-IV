import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { Auth, signOut, User } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChatComponent } from "./components/chat/chat.component";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoginComponent, CommonModule, ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'saladejuegos';
  currentIcon: string = '';
  flagError: boolean = false;
  notification:string ="";

  usuarioLogueado: string = "";

  constructor(private router: Router, 
              public auth: Auth) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateIcon();
      }
    });
  }

  recibirDato(datoHijo: string){
    this.usuarioLogueado = datoHijo;
  }


  //@Input() usuarioLogueado: any;

/*
  logout() {
    this.auth.logout();  // Aquí deberías llamar al método de logout en tu AuthService
    this.router.navigate(['/login']);  // Redirigir al login después de cerrar sesión
  }*/

  logout(){
    signOut(this.auth).then(() =>{
      this.flagError = false;
      this.goToHome();
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

  goToHome():void{
    this.router.navigate(['/home']);
  }

  updateIcon() {
    const currentRoute = this.router.url;

    switch (currentRoute) {
      case '/home':
        this.currentIcon = 'home-icon.png';
        break;
      case '/login':
        this.currentIcon = 'login-icon.png';
        break;
      case '/quiensoy':
        this.currentIcon = 'favicon.png';
        break;
      case '/registrarse':
        this.currentIcon = 'registrarse-icon.png';
        break;
      default:
        this.currentIcon = 'favicon.png';
        break;
    }
  }


}
