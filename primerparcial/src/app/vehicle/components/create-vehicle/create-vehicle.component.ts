import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vehicle } from '../../../models/vehicle';

@Component({
  selector: 'app-create-vehicle',
  standalone: false,
  //imports: [],
  templateUrl: './create-vehicle.component.html',
  styleUrl: './create-vehicle.component.css'
})
export class CreateVehicleComponent {

  successMessage: string | undefined;
  altaVehiculoForm!: FormGroup;
  @Output() vehiculo = new EventEmitter<Vehicle>();

  get nombre() {
    return this.altaVehiculoForm.get('nombre');
  }
  get tipo() {
    return this.altaVehiculoForm.get('tipo');
  }
  get cantidadRuedas() {
    return this.altaVehiculoForm.get('cantidadRuedas');
  }
  get capacidad() {
    return this.altaVehiculoForm.get('capacidad');
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.altaVehiculoForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)?$')]],
      tipo: ['', Validators.required],
      cantidadRuedas: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.max(6)]],
      capacidad: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(2), Validators.max(100)]],
    });
  }

  onSubmit() {
    if (this.altaVehiculoForm.valid) {

      const vehiculoCreado = new Vehicle(
        this.nombre?.value,
        this.tipo?.value,
        this.cantidadRuedas?.value,
        this.capacidad?.value
      );

      this.showSuccessMessage();

      this.vehiculo.emit(vehiculoCreado);
    }
  }

  showSuccessMessage() {
    this.altaVehiculoForm.reset();
    this.successMessage = 'Vehículo creado exitosamente.';
    setTimeout(() => {
      this.successMessage = undefined;
    }, 2500);
  }
}
