import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'Clase01 Ej01';
  edadUno!: string;
  edadDos!: string;
  suma!: number;
  promedio!: number;
  mostrarResultados: boolean = false;

  calcular() {

    const edadUnoNum = parseInt(this.edadUno);
    const edadDosNum = parseInt(this.edadDos);

    if (!isNaN(edadUnoNum) && !isNaN(edadDosNum)) {
      this.suma = edadUnoNum + edadDosNum;
      this.promedio = (edadUnoNum + edadDosNum) / 2;
      this.mostrarResultados = true;
    } else {
      alert('Por favor ingrese dos números válidos.');
    }
    
  }

  limpiar() {
    this.edadUno = '';
    this.edadDos = '';
    this.suma = 0;
    this.promedio = 0;
    this.mostrarResultados = false;
  }

}
