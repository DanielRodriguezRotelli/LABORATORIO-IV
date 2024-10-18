import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Icecream } from '../../../models/iceCream';

@Component({
  selector: 'app-create-icecream',
  standalone: false,
  //imports: [],
  templateUrl: './create-icecream.component.html',
  styleUrl: './create-icecream.component.css'
})
export class CreateIcecreamComponent {

  successMessage: string | undefined;
  altaHeladoForm!: FormGroup;
  @Output() helado = new EventEmitter<Icecream>();

  get nombre() {
    return this.altaHeladoForm.get('nombre');
  }
  get tipo() {
    return this.altaHeladoForm.get('tipo');
  }
  get precio() {
    return this.altaHeladoForm.get('precio');
  }
  get peso() {
    return this.altaHeladoForm.get('peso');
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.altaHeladoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      tipo: ['',Validators.pattern('^[0-9]{6}$') Validators.required],
      precio: ['',Validators.pattern('^[0-9]}$') Validators.required],
      peso: [
        '',
        [Validators.required, Validators.min(2), Validators.max(100)],
      ],
    });
  }

  onSubmit() {
    if (this.altaHeladoForm.valid) {

      const heladoCreado = new Icecream(
        this.nombre?.value,
        this.tipo?.value,
        this.precio?.value,
        this.peso?.value
      );

      this.showSuccessMessage();

      this.helado.emit(heladoCreado);
    }
  }

  showSuccessMessage() {
    this.altaHeladoForm.reset();
    this.successMessage = 'Helado creado exitosamente.';
    setTimeout(() => {
      this.successMessage = undefined;
    }, 2500);
  }
}
