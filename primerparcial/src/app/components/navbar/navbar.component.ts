import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  loggedUser = this.authService.getLoggedUser();

  isLogged = this.authService.isLoggedIn();

  constructor( private authService: AuthService, 
               private router: Router ) {}

  logout(): void {
    this.authService.logout().then( () => {
      this.router.navigateByUrl('/login');
    }, (err: any) => {
      alert(err);
    }
    );
  }
}
