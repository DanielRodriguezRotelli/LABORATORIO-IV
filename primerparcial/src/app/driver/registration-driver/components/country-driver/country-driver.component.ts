import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Country } from '../../../../models/country';
import { CountryService } from '../../../../services/country.service';

@Component({
  selector: 'app-country-driver',
  standalone: false,
  //imports: [],
  templateUrl: './country-driver.component.html',
  styleUrl: './country-driver.component.css'
})
export class CountryDriverComponent implements OnInit{

  protected listadoPaises: Country[] = [];
  @Output() public paisSeleccionado: EventEmitter<any>;


  constructor(
    private readonly paisesService: CountryService) 
    {
    this.paisSeleccionado = new EventEmitter();
  }

  ngOnInit() {
    // Call the service to get the list of countries and populate listadoPaises
    this.paisesService.getCountries().subscribe(
      (paises: Country[]) => {
        this.listadoPaises = paises;
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  public seleccionarPais(pais: Country) {
    this.paisSeleccionado.emit(pais);
  }
}
