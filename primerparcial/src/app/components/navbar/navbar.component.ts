import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  loggedUser = this.authService.getLoggedUser();  // Obtener el usuario logueado
  isLogged$!: Observable<boolean>;       // Verificar si está logueado
  isAdmin$!: Observable<boolean>;                 // Observable para saber si es admin

  constructor( 
    private authService: AuthService, 
    private router: Router) {}


  ngOnInit(): void {
    this.isLogged$ = this.authService.isLoggedIn(); 
    // Suscribirse al observable para verificar si el usuario es admin
    this.isAdmin$ = this.authService.getIsAdmin();
  }


  logout(): void {
    this.authService.logout().then( () => {
      this.router.navigateByUrl('/login');
    }, (err: any) => {
      alert(err);
    }
    );
  }
}
