import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailVehicleComponent } from './components/detail-vehicle/detail-vehicle.component';

const routes: Routes = [
  { path: '', component: DetailVehicleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }
