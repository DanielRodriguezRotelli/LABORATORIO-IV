import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  formRegistroUsuario!: FormGroup;
  errorMessage: string | undefined;
  successMessage: string | undefined;

  constructor( 
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {}

  ngOnInit(): void
  {

    this.formRegistroUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
      //captcha: ['', Validators.required]
    })
  }


  //ENVIAR FORMS 
  async onSubmit() {
    if (this.formRegistroUsuario.valid) {
      const { email, password } = this.formRegistroUsuario.value;

      try {
        // Crear usuario en Firebase Authentication
        const userCredential = await this.authService.registerUser(email, password);

        // Cerrar sesión después del registro
        await this.authService.logout();

        // Redirigir a términos y condiciones
        this.router.navigate(['/terms']);
      } catch (error: any) {
        console.error('Error al registrar el usuario:', error);
        switch (error.code) {
          case 'auth/email-already-in-use':
            this.errorMessage = 'El correo ya está en uso.';
            break;
          case 'auth/invalid-email':
            this.errorMessage = 'Correo no válido.';
            break;
          case 'auth/weak-password':
            this.errorMessage = 'La contraseña es demasiado débil.';
            break;
          default:
            this.errorMessage = 'Ocurrió un error. Inténtalo nuevamente.';
        }
      }
    }
  }

  ShowSuccessMessage() {
    this.formRegistroUsuario.reset();
    this.successMessage = '¡¡¡Registrado!!!';
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

  //GETTERS
  get mailUser()
  {
    return this.formRegistroUsuario.get('email');
  }
  get passwordUser()
  {
    return this.formRegistroUsuario.get('password');
  }
  
 
}
