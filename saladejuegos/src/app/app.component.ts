import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { Auth, signOut, User } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChatComponent } from "./components/chat/chat.component";
import { ScoreService } from './services/score.service';



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
  isDropdownOpen : boolean = false;
  usuarioLogueado: string = "";
  showModal: boolean = false;  // Nuevo: Controla si se muestra el modal

  constructor(private router: Router, 
              public auth: Auth,
              private scoreService: ScoreService) {}

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

  toggleDropdown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation(); // Evita que el evento se propague
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Cierra el dropdown si se hace clic fuera de él
  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    // Cierra el dropdown solo si se hace clic fuera de él
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.dropdown-menu');
  
    if (this.isDropdownOpen && dropdown && !dropdown.contains(target)) {
      this.isDropdownOpen = false;
    }
  }

  selectGame(game: string) {
    console.log('entro a selectgame');
    console.log('selecciono: '+ game);
    this.scoreService.setSelectedGame(game); // Establece el juego seleccionado
    this.isDropdownOpen = false; // Cierra el dropdown
    this.router.navigate(['/score']);
  }

  // Mostrar el modal al hacer clic en "Cerrar sesión"
  logout(event: MouseEvent) {
    event.preventDefault();  // Evitar que el enlace refresque la página
    this.showModal = true;   // Mostrar el modal
  }

  // Confirmar encuesta y redirigir
  completeSurvey() {
    this.showModal = false;
    this.router.navigate(['/survey']); // Redirigir a la encuesta
  }
  
  closeModalAndLogout(){
    this.showModal = false;
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
