import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Repartidor } from '../../../../models/repartidor';
import { FirestoreService } from '../../../../services/firestore.service';

@Component({
  selector: 'app-list-dealer',
  standalone: false,
  //imports: [],
  templateUrl: './list-dealer.component.html',
  styleUrl: './list-dealer.component.css'
})
export class ListDealerComponent implements OnInit {

  repartidores: Repartidor[] = [];

  @Output() repartidorSeleccionado = new EventEmitter<Repartidor>();


  constructor(private firestoreService: FirestoreService) {}

  async ngOnInit() {
    try {
      this.repartidores = await this.firestoreService.get('repartidores');
    } catch (error) {
      console.error('Error fetching repartidores:', error);
    }
  }

  seleccionarRepartidor(repartidor: Repartidor) {
    this.repartidorSeleccionado.emit(repartidor);
  }
}