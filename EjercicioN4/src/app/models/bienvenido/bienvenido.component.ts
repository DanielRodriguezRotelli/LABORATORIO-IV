import { Component } from '@angular/core';
import { Usuario } from '../usuario';

@Component({
  selector: 'app-bienvenido',
  standalone: true,
  imports: [],
  templateUrl: './bienvenido.component.html',
  styleUrl: './bienvenido.component.css'
})
export class BienvenidoComponent {
  user: Usuario = new Usuario("Daniel", "123");
  title: string = "BIENVENIDO ";
  mensaje: string = '¡Bienvenido a la aplicación!';
}
