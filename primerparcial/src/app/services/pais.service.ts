import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Pais } from '../models/pais';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  private apiUrl =
  'https://restcountries.com/v3.1/all?fields=flags,name,region';

  constructor(private http: HttpClient) {}


  getPaises(): Observable<Pais[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((data: any[]) => {
        // Filter countries from Europe and Africa
        const filteredCountries = data.filter((country: any) => {
          return country.region === 'Europe' || country.region === 'America';
        });

        // Limit the results to 3 countries from each region
        const europeCountries = filteredCountries.filter((country: any) => country.region === 'Europe').slice(0, 3);
        const africaCountries = filteredCountries.filter((country: any) => country.region === 'America').slice(0, 3);

        // Merge the selected countries and map them to the Pais type
        const selectedCountries: Pais[] = [
          ...europeCountries.map(
            (country: any) => new Pais(country.name.common, country.flags.png)
          ),
          ...africaCountries.map(
            (country: any) => new Pais(country.name.common, country.flags.png)
          ),
        ];

        return selectedCountries;
      })
    );
  }

  getPaisPorNombre(nombrePais: string): Observable<Pais | null> {
    return this.getPaises().pipe(
      map((paises: Pais[]) => {
        const paisEncontrado = paises.find(
          (pais: Pais) => pais.nombre === nombrePais
        );
        return paisEncontrado || null;
      })
    );
  }


}