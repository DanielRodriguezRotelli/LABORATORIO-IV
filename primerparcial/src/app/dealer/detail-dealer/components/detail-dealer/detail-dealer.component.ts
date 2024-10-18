import { Component } from '@angular/core';
import { Repartidor } from '../../../../models/repartidor';

@Component({
  selector: 'app-detail-dealer',
  standalone: false,
  //imports: [],
  templateUrl: './detail-dealer.component.html',
  styleUrl: './detail-dealer.component.css'
})
export class DetailDealerComponent {

  repartidorSeleccionado: Repartidor | null = null;

  onRepartidorSelected(repartidor: Repartidor) {
    this.repartidorSeleccionado = repartidor;
  }

}
