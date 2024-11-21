import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
  standalone: true
})
export class CapitalizePipe implements PipeTransform {

  //ESTE PIPE SE UTILIZA EN: - GESTON-USUARIOS, PACIENTES, MIS TURNOS, TABLA PACIENTE, TABLA ESPECIALISTAS
  transform(texto: string | undefined): string | undefined {
    if (texto != undefined) {
      return texto.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    } else {
      return texto;
    }
  }

}