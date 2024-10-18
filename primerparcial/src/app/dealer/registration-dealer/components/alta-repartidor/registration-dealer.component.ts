import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Pais } from '../../../../models/pais';
import { Repartidor } from '../../../../models/repartidor';
import { FirestoreService } from '../../../../services/firestore.service';
import { DealerService } from '../../../../services/dealer.service';

@Component({
  selector: 'app-registration-dealer',
  standalone: false,
  //imports: [],
  templateUrl: './registration-dealer.component.html',
  styleUrl: './registration-dealer.component.css'
})
export class RegistrationDealerComponent {

  paisSeleccionado: Pais = new Pais('', ''); // Initialize with empty values
  repartidor: Repartidor = new Repartidor();
  altaRepartidorForm!: FormGroup;
  errorMessage: string | undefined;
  successMessage: string | undefined;

  get dni() {
    return this.altaRepartidorForm.get('dni');
  }

  get nombre() {
    return this.altaRepartidorForm.get('nombre');
  }

  get apellido() {
    return this.altaRepartidorForm.get('apellido');
  }

  get pais() {
    return this.altaRepartidorForm.get('pais');
  }

  get unidadPropia() {
    return this.altaRepartidorForm.get('unidadPropia');
  }

  get edad() {
    return this.altaRepartidorForm.get('edad');
  }

  get capacidad() {
    return this.altaRepartidorForm.get('capacidad');
  }

  constructor( private formBuilder: FormBuilder,
               private firestoreService: FirestoreService, 
               private deliveryPersons: DealerService
  ) {}

  ngOnInit(): void {
    this.altaRepartidorForm = this.formBuilder.group({
      nombre: ['', [Validators.pattern('^[a-zA-Z]+$'), Validators.required]],
      edad: ['', [Validators.pattern('^[0-9]*$'), Validators.min(18), Validators.max(99), Validators.required, ]],
      dni: ['', [Validators.pattern('^[0-9]{7,8}$'), Validators.required,]],
      pais: ['', [Validators.required]],
      unidadPropia: ['', [Validators.required]],
      capacidad: ['', [Validators.required, Validators.min(1)]],
    });
  }

  handlePaisSeleccionado(pais: Pais) {
    this.paisSeleccionado = pais;
    this.pais?.patchValue(pais.nombre);
  }

  validateInputs(): boolean {
    if (!this.nombre?.valid) {
      this.errorMessage =
        "El campo 'Nombre' es inválido, tiene que ingresar sólo letras, sin caracteres especiales.";
      this.showMessage(this.errorMessage);
      return false;
    }
    if (!this.dni?.valid) {
      this.errorMessage =
        "El campo 'DNI' es inválido, tienen que ser de 7 a 8 caracteres.";
      this.showMessage(this.errorMessage);
      return false;
    }
    if (!this.edad?.valid) {
      this.errorMessage =
        "El campo 'Edad' es inválido, tiene que ser un número entero entre 18 y 99.";
      this.showMessage(this.errorMessage);
      return false;
    }
    if (!this.capacidad?.valid) {
      this.errorMessage =
        "El campo 'Capacidad de Transporte' es inválido, tiene que ingresar un número mayor a cero.";
      this.showMessage(this.errorMessage);
      return false;
    }
    if (this.unidadPropia === undefined) {
      this.errorMessage = 'Debe seleccionar si posee unidad propia.';
      this.showMessage(this.errorMessage);
      return false;
    }
    if (this.pais === undefined) {
      this.errorMessage = 'Debe seleccionar un pais.';
      this.showMessage(this.errorMessage);
      return false;
    }
    return true;
  }

  createDeliveryPerson() {
    if (this.validateInputs()) {
      this.deliveryPersons.updateDeliveryPersons(
        this.nombre?.value,
        this.dni?.value,
        this.edad?.value,
        this.capacidad?.value,
        this.unidadPropia?.value,
        this.pais?.value
      );
      this.showSuccessMessage();
    }
  }

  showSuccessMessage() {
    this.altaRepartidorForm.reset();
    this.successMessage = 'Repartidor creado exitosamente.';
    setTimeout(() => {
      this.successMessage = undefined;
    }, 2500);
  }

  showMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = undefined;
    }, 2500);
  }
}