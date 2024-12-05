import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { Country } from '../models/country';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private apiUrl = 'https://restcountries.com/v3.1/all?fields=flags,name,region';

  constructor(private http: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((data: any[]) => {
        console.log('data: ', data);
  
        // Filtrar países de Europa y América
        const filteredCountries = data.filter(
          (country: any) => country.region === 'Europe' || country.region === 'Americas'
        );
  
        // Función para obtener un arreglo con países seleccionados aleatoriamente
        const getRandomCountries = (countries: any[], count: number): any[] => {
          const shuffled = countries.sort(() => Math.random() - 0.5); // Mezcla aleatoria
          return shuffled.slice(0, count); // Toma los primeros 'count' elementos
        };
  
        // Selección aleatoria de 3 países de cada región
        const europeCountries = getRandomCountries(
          filteredCountries.filter((country: any) => country.region === 'Europe'),
          3
        );
  
        const americaCountries = getRandomCountries(
          filteredCountries.filter((country: any) => country.region === 'Americas'),
          3
        );
  
        // Crear objetos de tipo Country con los nombres en español
        const selectedCountries: Country[] = [
          ...europeCountries.map((country: any) => ({
            name: country.name.common, // Aquí asignamos directamente el valor de "name"
            flag: country.flags.png,  // Y el valor de "flag"
          })),
          ...americaCountries.map((country: any) => ({
            name: country.name.common,
            flag: country.flags.png,
          })),
        ];
  
        return selectedCountries;
      })
    );
  }


  getData(): Observable<Country[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      take(10),
      map((response: any[]) => {
        console.log('data: ', response);
        const list: Country[] = [];
        response.forEach((result: any) => {
          const data: Country = {
            name: result.name.common,
            flag: result.flags.png,
          };
          list.push(data);
        });
        return list;
      })
    );
  }

  getCountryByName(nombrePais: string): Observable<Country | null> {
    console.log('Pais: ',nombrePais);
    return this.getCountries().pipe(
      map((paises: Country[]) => {
        const paisEncontrado = paises.find(
          (pais: Country) => pais.name == nombrePais
        );
        console.log('getCountryByName: ', paisEncontrado);
        return paisEncontrado || null;
      })
    );
  }
}
