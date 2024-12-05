import { Component, Input } from '@angular/core';
import { Driver } from '../../../../models/driver';
import { DriverService } from '../../../../services/driver.service';

@Component({
  selector: 'app-detail-driver',
  standalone: false,
  //imports: [],
  templateUrl: './detail-driver.component.html',
  styleUrl: './detail-driver.component.css'
})
export class DetailDriverComponent {

  choferSeleccionado: Driver | null = null;
  @Input() listDrivers!: Driver[]; // Define the input property

  constructor(private driverService: DriverService) { }

  onChoferSelected(chofer: Driver) {
    this.choferSeleccionado = chofer;
    console.log('-Chofer seleccionado: ', this.choferSeleccionado);
  }

  seleccionar(item: Driver) {
    this.choferSeleccionado = item;
  }
}
