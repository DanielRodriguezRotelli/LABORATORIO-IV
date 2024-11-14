import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutosAHora',
  standalone: true
})
export class MinutosAHoraPipe implements PipeTransform {

  transform(minutos: number): string {
     // Calcula las horas y los minutos restantes
     let hora = Math.floor(minutos / 60);
     let minutosRestantes = minutos % 60;
 
     // Formatea la hora y los minutos para que siempre tengan dos dígitos
     let horaFormateada = String(hora).padStart(2, '0');
     let minutosFormateados = String(minutosRestantes).padStart(2, '0');
 
     // Retorna la hora en formato de 24 horas
     return `${horaFormateada}:${minutosFormateados}`;
   }

}