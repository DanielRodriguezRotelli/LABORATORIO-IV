import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Driver } from '../../../../models/driver';
import { FirestoreService } from '../../../../services/firestore.service';

@Component({
  selector: 'app-list-driver',
  standalone: false,
  //imports: [],
  templateUrl: './list-driver.component.html',
  styleUrl: './list-driver.component.css'
})
export class ListDriverComponent {

  choferes: Driver[] = [];

  @Input() listDrivers!: Driver[]; // Define the input property
  @Output() seleccionar: EventEmitter<Driver> = new EventEmitter<Driver>();

  constructor(private firestoreService: FirestoreService) {}

  async ngOnInit() {
    try {
      this.choferes = await this.firestoreService.get('choferes');
    } catch (error) {
      console.error('Error fetching choferes:', error);
    }
  }

  seleccionarChofer(listDrivers: Driver) {
    this.seleccionar.emit(listDrivers);
  }
}
