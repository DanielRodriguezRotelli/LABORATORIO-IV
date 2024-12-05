import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailDriverComponent } from './components/detail-driver/detail-driver.component';

const routes: Routes = [
  { path: '', component: DetailDriverComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailDriverRoutingModule { }
