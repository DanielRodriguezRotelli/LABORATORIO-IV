import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailDealerRoutingModule } from './detail-dealer-routing.module';
import { DetailDealerComponent } from './components/detail-dealer/detail-dealer.component';
import { ListDealerComponent } from './components/list-dealer/list-dealer.component';
import { PaisDealerComponent } from './components/pais-dealer/pais-dealer.component';
import { SelectedDealerComponent } from './components/selected-dealer/selected-dealer.component';
import { PaisService } from '../../services/pais.service';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    DetailDealerComponent,
    ListDealerComponent,
    PaisDealerComponent,
    SelectedDealerComponent
  ],
  imports: [
    CommonModule,
    DetailDealerRoutingModule,
    HttpClientModule
  ],
  providers: [
    PaisService
  ]
})
export class DetailDealerModule { }
