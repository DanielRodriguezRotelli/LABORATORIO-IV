import { Component } from '@angular/core';
import { User } from '../../models/user';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  user: User = new User("Daniel", "123");
  title: string = "BIENVENIDO ";
  mensaje: string = '¡Bienvenido a la aplicación!';
}
