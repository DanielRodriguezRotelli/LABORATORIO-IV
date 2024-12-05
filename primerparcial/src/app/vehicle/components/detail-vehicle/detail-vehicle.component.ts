import { Component, Input, input, SimpleChange } from '@angular/core';
import { Vehicle } from '../../../models/vehicle';
import { VehicleService } from '../../../services/vehicle.service';

@Component({
  selector: 'app-detail-vehicle',
  standalone: false,
  //imports: [],
  templateUrl: './detail-vehicle.component.html',
  styleUrl: './detail-vehicle.component.css'
})
export class DetailVehicleComponent {

  vehiculo?: Vehicle;
  @Input() listVehicles!: Vehicle[]; // Define the input property

  constructor(private vehiculoService: VehicleService) { }

  ngOnInit() {
    this.obtenerVehicles();
  }

  ngOnChanges(changes: SimpleChange): void {
    this.obtenerVehicles();
  }

  seleccionar(item: Vehicle) {
    this.vehiculo = item;
  }

  obtenerVehicles() {
    this.vehiculoService.getVehicleAsync()
    .then(res => {
      this.listVehicles = res;
    })
  }

  alta(item: Vehicle) {
    this.vehiculoService.createVehicleAsync(item)
    .then(() => {
      this.obtenerVehicles();
      this.vehiculo = undefined;
    })
  }

  modificar() {
    if (this.vehiculo) {
      this.vehiculoService.upDateVehicleAsync(this.vehiculo)
      .then(() => {
        this.obtenerVehicles();
        this.vehiculo = undefined;
      })
    }
  }

  borrar() {
    if (this.vehiculo) {
      this.vehiculoService.deleteVehicleAsync(this.vehiculo)
      .then(() => {
        this.obtenerVehicles();
        this.vehiculo = undefined;
      })
    }
  }
}
