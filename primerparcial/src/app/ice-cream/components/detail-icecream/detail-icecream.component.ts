import { Component, Input } from '@angular/core';
import { Icecream } from '../../../models/iceCream';
import { IceCreamService } from '../../../services/ice-cream.service';

@Component({
  selector: 'app-detail-icecream',
  standalone: false,
  //imports: [],
  templateUrl: './detail-icecream.component.html',
  styleUrl: './detail-icecream.component.css'
})
export class DetailIcecreamComponent {

  iceCream?: Icecream;
  @Input() list!: Icecream[]; // Define the input property

  constructor(private heladoService: IceCreamService) { }

  ngOnInit() {
    this.obtenerIceCream();
  }

  seleccionar(item: Icecream) {
    this.iceCream = item;
  }

  obtenerIceCream() {
    this.heladoService.getIceCreamAsync()
    .then(res => {
      this.list = res;
    })
  }

  alta(item: Icecream) {
    this.heladoService.createIceCreamAsync(item)
    .then(() => this.obtenerIceCream())
  }

  modificar() {
    if (this.iceCream) {
      this.heladoService.createIceCreamAsync(this.iceCream)
      .then(() => this.obtenerIceCream())
    }
  }

  borrar() {
    if (this.iceCream) {
      this.heladoService.deleteIceCreamAsync(this.iceCream)
      .then(() => {
        this.obtenerIceCream();
        this.iceCream = undefined;
      })
    }
  }
}