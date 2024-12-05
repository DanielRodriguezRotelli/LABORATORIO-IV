import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Vehicle } from '../../../models/vehicle';

@Component({
  selector: 'app-list-vehicle',
  standalone: false,
  //imports: [],
  templateUrl: './list-vehicle.component.html',
  styleUrl: './list-vehicle.component.css'
})
export class ListVehicleComponent {

  @Input() listVehicles!: Vehicle[]; // Define the input property
  @Output() seleccionar: EventEmitter<Vehicle> = new EventEmitter<Vehicle>();

  seleccionar_click(item: Vehicle) {
    this.seleccionar.emit(item);
  }
}