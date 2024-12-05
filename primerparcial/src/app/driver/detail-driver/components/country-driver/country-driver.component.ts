import { Component, Input } from '@angular/core';
import { Country } from '../../../../models/country';
import { CountryService } from '../../../../services/country.service';

@Component({
  selector: 'app-country-driver',
  standalone: false,
  //imports: [],
  templateUrl: './country-driver.component.html',
  styleUrl: './country-driver.component.css'
})
export class CountryDriverComponent {

  @Input() paisChoferSeleccionado?: string;
  paisSeleccionado?: Country | null = null;
  countries: Country[] = [];
  country: Country | undefined = undefined;

  constructor(private paisService: CountryService) {}

  ngOnInit(): void {
    this.getDataPais();
    if (this.countries.length === 0) {
      this.paisService.getData().subscribe((data) => {
        this.countries = data;
      });
    }
  }

  ngOnChanges(): void {
    this.getDataPais();
    if (this.paisChoferSeleccionado) {
      this.country = this.searchCountryByName(this.paisChoferSeleccionado);
      console.log(this.country, 'aca el pais seleccionado');
    }
  }

  private getDataPais() {
    if (this.paisChoferSeleccionado) {
      console.log('pais del chofer seleccionado: ',this.paisChoferSeleccionado);
      this.paisService.getCountryByName(this.paisChoferSeleccionado)
        .subscribe((data: Country | null) => {
          if (data) {
            this.paisSeleccionado = data;
            console.log('pais seleccionado: ',data);
          }
          else{
            console.log('No llega el pais seleccionado: ');
          }
        });
    }
  }

  searchCountryByName(countryName: string): Country | undefined {
    return this.countries.find(
      (item) => item?.name?.toLowerCase() === countryName.toLowerCase()
    );
  }
}
