import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleRoutingModule } from './vehicle-routing.module';
import { DetailVehicleComponent } from './components/detail-vehicle/detail-vehicle.component';
import { CreateVehicleComponent } from './components/create-vehicle/create-vehicle.component';
import { DeleteVehicleComponent } from './components/delete-vehicle/delete-vehicle.component';
import { UpdateVehicleComponent } from './components/update-vehicle/update-vehicle.component';
import { ListVehicleComponent } from './components/list-vehicle/list-vehicle.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DetailVehicleComponent,
    CreateVehicleComponent,
    DeleteVehicleComponent,
    UpdateVehicleComponent,
    ListVehicleComponent
  ],
  imports: [
    CommonModule,
    VehicleRoutingModule,
    ReactiveFormsModule
  ]
})
export class VehicleModule { }
