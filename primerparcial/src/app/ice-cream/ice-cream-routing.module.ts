import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailIcecreamComponent } from './components/detail-icecream/detail-icecream.component';

const routes: Routes = [
  { path: '', component: DetailIcecreamComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IceCreamRoutingModule { }
