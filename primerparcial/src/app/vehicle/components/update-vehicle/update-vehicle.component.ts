import { Component, EventEmitter, Input, input, Output, SimpleChange } from '@angular/core';
import { Vehicle } from '../../../models/vehicle';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-vehicle',
  standalone: false,
  //imports: [],
  templateUrl: './update-vehicle.component.html',
  styleUrl: './update-vehicle.component.css'
})
export class UpdateVehicleComponent {

  @Input() item?: Vehicle;
  @Output() confirmar: EventEmitter<void> = new EventEmitter<void>();
  modVehiculoForm!: FormGroup;

  get nombre() {
    return this.modVehiculoForm.get('nombre');
  }
  get tipo() {
    return this.modVehiculoForm.get('tipo');
  }
  get cantidadDeRuedas() {
    return this.modVehiculoForm.get('cantidadDeRuedas');
  }
  get capacidad() {
    return this.modVehiculoForm.get('capacidad');
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.modVehiculoForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)?$')]],
      tipo: ['', Validators.required],
      cantidadDeRuedas: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.max(6)]],
      capacidad: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(2), Validators.max(100)]],
    });
  }

  ngOnChanges(changes: SimpleChange): void {
    this.nombre?.setValue(this.item?.name);
    this.tipo?.setValue(this.item?.type);
    this.cantidadDeRuedas?.setValue(this.item?.cantidadDeRuedas);
    this.capacidad?.setValue(this.item?.capacidad);
  }

  confirmar_submit() {
    if (this.modVehiculoForm.valid && this.item) {
      this.item.name = this.nombre?.value;
      this.item.type = this.tipo?.value;
      this.item.capacidad = this.capacidad?.value;
      this.item.cantidadDeRuedas = this.cantidadDeRuedas?.value;

      this.confirmar.emit();

    } else {
      console.error(this.modVehiculoForm.errors);
    }
  }
}
