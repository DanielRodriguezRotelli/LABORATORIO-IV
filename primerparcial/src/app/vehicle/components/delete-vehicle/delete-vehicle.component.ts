import { Component, EventEmitter, Input, Output, SimpleChange } from '@angular/core';
import { Vehicle } from '../../../models/vehicle';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../../../services/vehicle.service';

@Component({
  selector: 'app-delete-vehicle',
  standalone: false,
  //imports: [],
  templateUrl: './delete-vehicle.component.html',
  styleUrl: './delete-vehicle.component.css'
})
export class DeleteVehicleComponent {

  @Input() item?: Vehicle;
  @Output() confirmar: EventEmitter<void> = new EventEmitter<void>();
  borrarVehiculoForm!: FormGroup;

  get nombre() {
    return this.borrarVehiculoForm.get('nombre');
  }
  get tipo() {
    return this.borrarVehiculoForm.get('tipo');
  }
  get cantidadRuedas() {
    return this.borrarVehiculoForm.get('cantidadRuedas');
  }
  get capacidad() {
    return this.borrarVehiculoForm.get('capacidad');
  }

  constructor(
    private formBuilder: FormBuilder,
    private vehiculoSrvice : VehicleService) {}

  ngOnInit(): void {
    console.log('ITEM: ', this.item);

    this.borrarVehiculoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      cantidadRuedas: ['', Validators.required],
      capacidad: ['', [Validators.required, Validators.min(250), Validators.max(1000)]],
    });
  }

  ngOnChanges(changes: SimpleChange): void {
    console.log('ITEM: ', this.item);

    this.nombre?.setValue(this.item?.name);
    this.tipo?.setValue(this.item?.type);
    this.cantidadRuedas?.setValue(this.item?.cantidadDeRuedas);
    this.capacidad?.setValue(this.item?.capacidad);
  }

  onSubmit() {
    console.log("Item: ", this.item);
    if (this.item) {
      console.error('entro en el primer IF');
      this.confirmar.emit();
      //this.vehiculoSrvice.deleteVehicle(this.item?.id!);
      this.item = undefined;
    } else {
      console.error('NO entro en el primer IF');
      console.error(this.borrarVehiculoForm.errors);
    }
  }
}