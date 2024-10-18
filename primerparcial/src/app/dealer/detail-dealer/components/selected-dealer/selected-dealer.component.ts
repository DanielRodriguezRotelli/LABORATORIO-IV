import { Component, Input } from '@angular/core';
import { Repartidor } from '../../../../models/repartidor';

@Component({
  selector: 'app-selected-dealer',
  standalone: false,
  //imports: [],
  templateUrl: './selected-dealer.component.html',
  styleUrl: './selected-dealer.component.css'
})
export class SelectedDealerComponent {

  @Input() repartidorSeleccionado: Repartidor | null = null;

}
