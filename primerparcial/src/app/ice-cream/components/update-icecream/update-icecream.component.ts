import { Component, EventEmitter, Input, Output, SimpleChange } from '@angular/core';
import { Icecream } from '../../../models/iceCream';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-icecream',
  standalone: false,
  //imports: [],
  templateUrl: './update-icecream.component.html',
  styleUrl: './update-icecream.component.css'
})
export class UpdateIcecreamComponent {

  @Input() item?: Icecream;
  @Output() confirmar: EventEmitter<void> = new EventEmitter<void>();
  modHeladoForm!: FormGroup;

  get nombre() {
    return this.modHeladoForm.get('nombre');
  }
  get tipo() {
    return this.modHeladoForm.get('tipo');
  }
  get precio() {
    return this.modHeladoForm.get('precio');
  }
  get peso() {
    return this.modHeladoForm.get('peso');
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.modHeladoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      precio: ['', Validators.required],
      peso: ['', [Validators.required, Validators.min(250), Validators.max(1000)]],
    });
  }

  ngOnChanges(changes: SimpleChange): void {
    this.nombre?.setValue(this.item?.nombre);
    this.tipo?.setValue(this.item?.tipo);
    this.precio?.setValue(this.item?.precio);
    this.peso?.setValue(this.item?.peso);
  }

  confirmar_submit() {
    if (this.modHeladoForm.valid && this.item) {

      this.item.tipo = this.tipo?.value;
      this.item.peso = this.peso?.value;
      this.item.precio = this.precio?.value;

      this.confirmar.emit();

    } else {
      console.error(this.modHeladoForm.errors);
    }
  }
}
