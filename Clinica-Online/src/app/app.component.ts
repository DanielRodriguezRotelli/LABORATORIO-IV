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

  ngOnInit() {}


  logOut()
  {
    this.authService.LogOut();
    this.router.navigateByUrl('bienvenida');
  }

 
}
