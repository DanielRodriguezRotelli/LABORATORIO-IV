import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent {

  accepted = false;
  formTerminos! : FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder) {}

  ngOnInit(): void
  {
    this.formTerminos = this.fb.group({
      edad: ['', [Validators.required, Validators.min(18), Validators.max(65)]],
      accepted: [false, Validators.requiredTrue], // Asegurarse de que el checkbox esté seleccionado

    })
  }

  async onSubmit() {
    if (this.formTerminos.valid) {
      try {
          this.router.navigate(['/welcome']); // Redirige a la página principal
          console.log('Redirigiendo a /welcome...');
      } catch (error: any) {
        console.error('Error al procesar el formulario:', error);
      }
    }
    else {
      console.log('Formulario inválido');
    }
  }

  
  isFormValid(): boolean {
    return this.formTerminos?.valid ?? false;
  }

  get edadlUser()
  {
    return this.formTerminos.get('edad');
  }
}
