import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationDealerComponent } from './components/alta-repartidor/registration-dealer.component';


const routes: Routes = [
  { path: '', component: RegistrationDealerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationDealerRoutingModule { }
