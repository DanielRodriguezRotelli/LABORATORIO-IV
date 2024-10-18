import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Pais } from '../../../../models/pais';
import { PaisService } from '../../../../services/pais.service';

@Component({
  selector: 'app-pais-repartidor',
  standalone: false,
  //imports: [],
  templateUrl: './pais-repartidor.component.html',
  styleUrl: './pais-repartidor.component.css'
})
export class PaisRepartidorComponent implements OnInit {

  protected listadoPaises: Pais[] = [];
  @Output() public paisSeleccionado: EventEmitter<any>;

  constructor(private readonly paisesService: PaisService) {
    this.paisSeleccionado = new EventEmitter();
  }

  ngOnInit() {
    // Call the service to get the list of countries and populate listadoPaises
    this.paisesService.getPaises().subscribe(
      (paises: Pais[]) => {
        this.listadoPaises = paises;
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  public seleccionarPais(pais: Pais) {
    this.paisSeleccionado.emit(pais);
  }
}
