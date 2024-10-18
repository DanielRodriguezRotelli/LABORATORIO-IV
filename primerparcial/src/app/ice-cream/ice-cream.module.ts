import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IceCreamRoutingModule } from './ice-cream-routing.module';
import { DetailIcecreamComponent } from './components/detail-icecream/detail-icecream.component';
import { CreateIcecreamComponent } from './components/create-icecream/create-icecream.component';
import { DeleteIcecreamComponent } from './components/delete-icecream/delete-icecream.component';
import { UpdateIcecreamComponent } from './components/update-icecream/update-icecream.component';
import { ListIcecreamComponent } from './components/list-icecream/list-icecream.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DetailIcecreamComponent,
    CreateIcecreamComponent,
    DeleteIcecreamComponent,
    UpdateIcecreamComponent,
    ListIcecreamComponent
  ],
  imports: [
    CommonModule,
    IceCreamRoutingModule,
    ReactiveFormsModule
  ]
})
export class IceCreamModule { }
