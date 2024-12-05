import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailDriverRoutingModule } from './detail-driver-routing.module';
import { DetailDriverComponent } from './components/detail-driver/detail-driver.component';
import { CountryDriverComponent } from './components/country-driver/country-driver.component';
import { ListDriverComponent } from './components/list-driver/list-driver.component';
import { SelectedDriverComponent } from './components/selected-driver/selected-driver.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { SharedModule } from '../../shared/shared/shared.module';


@NgModule({
  declarations: [
    DetailDriverComponent,
    CountryDriverComponent,
    ListDriverComponent,
    SelectedDriverComponent,
    //TranslatePipe
  ],
  imports: [
    CommonModule,
    DetailDriverRoutingModule,
    SharedModule
  ]
})
export class DetailDriverModule { }
