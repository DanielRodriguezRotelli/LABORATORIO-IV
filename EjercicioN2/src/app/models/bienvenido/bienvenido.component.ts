import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../../app.component';
import { Usuario } from '../usuario';

@Component({
  selector: 'app-bienvenido',
  standalone: true,
  imports: [FormsModule, AppComponent],
  templateUrl: './bienvenido.component.html',
  styleUrl: './bienvenido.component.css'
})
export class BienvenidoComponent {
  user: Usuario = new Usuario("Daniel", "123");
  title: string = "BIENVENIDO ";
  mensaje: string = '¡Bienvenido a la aplicación!';

}