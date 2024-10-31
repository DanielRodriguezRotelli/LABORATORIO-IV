import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'clinicaonline';

  
  constructor(
    public authService: AuthService, 
    public router: Router){}

  ngOnInit() {
    // Espera a que el usuario se cargue antes de continuar
    this.authService.esperarCargarUsuario().then(() => {
      console.log("Usuario cargado:", this.authService.usuarioLogeado);
    });
  }


  logOut()
  {
    this.authService.LogOut();
    this.router.navigateByUrl('bienvenida');
  }

 
}
