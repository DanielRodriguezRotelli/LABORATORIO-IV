import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationDriverRoutingModule } from './registration-driver-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CountryService } from '../../services/country.service';
import { CountryDriverComponent } from './components/country-driver/country-driver.component';
import { RegistrationDriverComponent } from './components/registration-driver/registration-driver.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { SharedModule } from '../../shared/shared/shared.module';



@NgModule({
  declarations: [
    CountryDriverComponent,
    RegistrationDriverComponent,
    //TranslatePipe
  ],
  imports: [
    CommonModule,
    RegistrationDriverRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    CountryService
  ]
})
export class RegistrationDriverModule { }
