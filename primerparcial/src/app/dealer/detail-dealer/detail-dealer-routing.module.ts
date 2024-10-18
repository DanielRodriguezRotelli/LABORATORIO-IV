import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailDealerComponent } from './components/detail-dealer/detail-dealer.component';

const routes: Routes = [
  { path: '', component: DetailDealerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailDealerRoutingModule { }
