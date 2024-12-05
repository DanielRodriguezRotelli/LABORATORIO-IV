import { Component, Input } from '@angular/core';
import { Driver } from '../../../../models/driver';

@Component({
  selector: 'app-selected-driver',
  standalone: false,
  //imports: [],
  templateUrl: './selected-driver.component.html',
  styleUrl: './selected-driver.component.css'
})
export class SelectedDriverComponent {

  @Input() choferSeleccionado: Driver | null = null;
}
