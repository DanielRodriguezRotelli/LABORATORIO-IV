import { Component } from '@angular/core';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {
  title: string = "ERROR";
  mensaje: string = 'Ha ocurrido un error. Inténtalo de nuevo.';
}
