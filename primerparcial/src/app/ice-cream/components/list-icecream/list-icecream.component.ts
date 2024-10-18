import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Icecream } from '../../../models/iceCream';

@Component({
  selector: 'app-list-icecream',
  standalone: false,
  //imports: [],
  templateUrl: './list-icecream.component.html',
  styleUrl: './list-icecream.component.css'
})
export class ListIcecreamComponent {

  @Input() list!: Icecream[]; // Define the input property
  @Output() seleccionar: EventEmitter<Icecream> = new EventEmitter<Icecream>();

  seleccionar_click(item: Icecream) {
    this.seleccionar.emit(item);
  }
}
