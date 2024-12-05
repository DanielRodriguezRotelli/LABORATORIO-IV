import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

    // Diccionario de traducciones para algunos países
    private translations:{ [key: string]: string } = {
      'United States': 'Estados Unidos',
      'Canada': 'Canadá',
      'Argentina': 'Argentina',
      'Brazil': 'Brasil',
      'Luxembourg' : 'Luxemburgo',
      'United States Minor Outlying Islands': 'Islas Ultramarinas Menores de los Estados Unidos',
      'Moldova' : 'Moldavia',
      'Germany': 'Alemania',
      'Antigua and Barbuda':'Antigua y Barbuda',
      'Latvia' : 'Letonia',
      'Martinique': 'Martinica',
      'Spain': 'España',
      'France': 'Francia',
      'Italy': 'Italia',
      'Switzerland': 'Suiza',
      'Belgium':'Belgica',
      'Ireland':'Irlanda',
      'Ukraine':'Ucrania',
      'Cyprus':'Chipre',
      'Caribbean Netherlands':'Caribe Neerlandés',
      'Denmark': 'Dinamarca',
      'Lithuania' : 'Lituania',
      'Saint Kitts and Nevis': 'San Cristóbal y Nieves',
      'Romania': 'Rumania',
      'United States Virgin Islands': 'Islas Vírgenes de los Estados Unidos',
      'Cayman Islands':'Islas Cayman',
      'Saint Pierre and Miquelon':'San Pedro y Miquelón',
      'Bosnia and Herzegovina':'Bosnia y Herzegovina',
      'Czechia':'Republica Checa',
      'North Macedonia':'Macedonia del Norte',
      'Dominican Republic':'Republica Dominicana',
      'Turks and Caicos Islands': 'Islas Turcas y Caicos',
      'United Kingdom':'Reino Unido',
      'Greece':'Grecia',
      'Åland Islands':'Åland',
      'Slovenia':'Eslovenia',
      'Vatican City':'Cuidad del Vaticano',
      'Croatia':'Croacia',
      'Hungary':'Hungria',
      'Netherlands': 'Paises Bajos',
      'Norway':'Noruega',
      'Sweden':'Suecia',
      'Russia': 'Rusia',
      'Iceland': 'Islandia',
      'Greenland': 'Groenlandia',
      'Saint Vincent and the Grenadines':'San Vicente y las Granadinas',
      'Poland':'Polonia',
      'British Virgin Islands': 'Islas Vírgenes Británicas',
      'Saint Barthélemy':'San Bartolomé',
      'Belarus': 'Bielorrusia',
      'Trinidad and Tobago':'Trinidad y Tobago',
      'Grenada':'Granada',
      'Faroe Islands':'Islas Feroe',
      'Slovakia':'Eslovaquia',
      'Curaçao':'Curazao',
      'French Guiana':'Guayana Francesa',
      'Svalbard and Jan Mayen':'Svalbard y Jan Mayen'
      // Agrega más países aquí
    };
  
    transform(value: string): string {
      // Si el país tiene una traducción, lo devuelve, si no, devuelve el nombre original
      return this.translations[value] || value;
    }
}
