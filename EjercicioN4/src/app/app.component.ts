import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from './models/login/login.component';
import { BienvenidoComponent } from './models/bienvenido/bienvenido.component';
import { ErrorComponent } from './models/error/error.component';
import { RegistrarComponent } from './models/registrar/registrar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoginComponent, BienvenidoComponent, ErrorComponent, RegistrarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title: string = 'EJERCICIO N°4';

  constructor(private router: Router) {
  }

  goTo(path : string){
    this.router.navigate([path]);
  }
}
