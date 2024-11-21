import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayToString',
  standalone: true
})
export class ArrayToStringPipe implements PipeTransform {

  // transforma un array en un string concatenando sus elementos, separados por comas.
  // ESTE PIPE SE UTILIZA EN: - TABLA ESPECIALISTAS
  transform(array: any[], campo: string = ''): string {
    if (!Array.isArray(array)) {
      return '';
    }
    
    if (campo) {
      return array.map(item => item[campo]).join(', ');
    }
    
    return array.join(', ');
  }


}
