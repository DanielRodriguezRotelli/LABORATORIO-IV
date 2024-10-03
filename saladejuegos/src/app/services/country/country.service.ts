import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private apiUrl = 'https://restcountries.com/v3.1/all?fields=flags,name,translations';

  constructor(private http: HttpClient){}

  //function to fetch a list of countries
  //function to fetch a list of countries with flags and names
  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((data: any[]) => {
        return data.map((country) => ({
          flag: country.flags.png,
          // name: country.name.common , // Use Spanish name if available
          name: country.translations.spa.official
        }));
      })
    );
  }


  getCountry(alpha3Code: string): Observable<any> {
    const url = `${this.apiUrl}/alpha/${alpha3Code}`;
    return this.http.get<any>(url);
  }
}
