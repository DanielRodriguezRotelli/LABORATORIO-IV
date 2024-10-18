import { Component, Input } from '@angular/core';
import { Pais } from '../../../../models/pais';
import { PaisService } from '../../../../services/pais.service';

@Component({
  selector: 'app-pais-dealer',
  standalone: false,
  //imports: [],
  templateUrl: './pais-dealer.component.html',
  styleUrl: './pais-dealer.component.css'
})
export class PaisDealerComponent {

  @Input() paisRepartidorSeleccionado?: string;
  paisSeleccionado?: Pais | null = null;

  constructor(private paisService: PaisService) {}

  ngOnInit(): void {
    this.getDataPais();
  }

  ngOnChanges(): void {
    this.getDataPais();
  }

  private getDataPais() {
    if (this.paisRepartidorSeleccionado) {
      this.paisService.getPaisPorNombre(this.paisRepartidorSeleccionado)
        .subscribe((data: Pais | null) => {
          if (data) {
            this.paisSeleccionado = data;
          }
        });
    }
  }
}