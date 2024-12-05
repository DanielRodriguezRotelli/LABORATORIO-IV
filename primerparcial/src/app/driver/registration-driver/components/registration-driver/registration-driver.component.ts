import { Component } from '@angular/core';
import { Country } from '../../../../models/country';
import { Driver } from '../../../../models/driver';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../../services/firestore.service';
import { DriverService } from '../../../../services/driver.service';

@Component({
  selector: 'app-registration-driver',
  standalone: false,
  //imports: [],
  templateUrl: './registration-driver.component.html',
  styleUrl: './registration-driver.component.css'
})
export class RegistrationDriverComponent {

  paisSeleccionado: Country = new Country('', ''); // Initialize with empty values
  chofer: Driver = new Driver();
  altaChoferForm!: FormGroup;
  errorMessage: string | undefined;
  successMessage: string | undefined;

  get dni() {
    return this.altaChoferForm.get('dni');
  }

  get nombre() {
    return this.altaChoferForm.get('nombre');
  }

  get apellido() {
    return this.altaChoferForm.get('apellido');
  }

  get pais() {
    return this.altaChoferForm.get('pais');
  }

  get tieneLicencia() {
    return this.altaChoferForm.get('tieneLicencia');
  }

  get edad() {
    return this.altaChoferForm.get('edad');
  }

  get numeroLicencia() {
    return this.altaChoferForm.get('numeroLicencia');
  }

  constructor( 
    private formBuilder: FormBuilder,
    private firestoreService: FirestoreService, 
    private driverPersons: DriverService) {}

  ngOnInit(): void {
    this.altaChoferForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      edad: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(18), Validators.max(50)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      pais: ['', [Validators.required]],
      tieneLicencia: ['', [Validators.required]],
      numeroLicencia: ['', [Validators.required, Validators.pattern('^[0-9]{7}$')]],
    });
  }

  handlePaisSeleccionado(pais: Country) {
    this.paisSeleccionado = pais;
    this.pais?.patchValue(pais.name);
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
        "El campo 'Edad' es inválido, tiene que ser un número entero entre 18 y 50.";
      this.showMessage(this.errorMessage);
      return false;
    }
    if (!this.numeroLicencia?.valid) {
      this.errorMessage =
        "El campo 'Numero de licencia' es inválido, tiene que ingresar un número mayor a cero.";
      this.showMessage(this.errorMessage);
      return false;
    }
    if (this.tieneLicencia === undefined) {
      this.errorMessage = 'Debe seleccionar si posee licencia profesional.';
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

  createDriverPerson() {
    if (this.validateInputs()) {
      this.driverPersons.updateDriverPersons(
        this.nombre?.value,
        this.dni?.value,
        this.edad?.value,
        this.numeroLicencia?.value,
        this.tieneLicencia?.value,
        this.pais?.value
      );
      this.showSuccessMessage();
    }
  }

  showSuccessMessage() {
    this.altaChoferForm.reset();
    this.successMessage = 'Chofer creado exitosamente.';
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
