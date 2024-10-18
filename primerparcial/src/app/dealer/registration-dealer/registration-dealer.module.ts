import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationDealerRoutingModule } from './registration-dealer-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PaisService } from '../../services/pais.service';
import { PaisRepartidorComponent } from './components/pais-repartidor/pais-repartidor.component';
import { RegistrationDealerComponent } from './components/alta-repartidor/registration-dealer.component';


@NgModule({
  declarations: [
    PaisRepartidorComponent,
    RegistrationDealerComponent
  ],
  imports: [
    CommonModule,
    RegistrationDealerRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    PaisService
  ]
})
export class RegistrationDealerModule { }
