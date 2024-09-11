import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'saladejuegos';
  currentIcon: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateIcon();
      }
    });
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
