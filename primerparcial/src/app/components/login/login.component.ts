import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  http = inject(HttpClient);
  errorMessage: string | undefined;
  successMessage: string | undefined;
  role: string | undefined;


  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  constructor( private formBuilder: FormBuilder,
               private authService: AuthService,
               private router: Router) {
              
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }



  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).then(
        (res) => {
          this.ShowSuccessMessage();
          this.router.navigateByUrl('/welcome');
        },
        (error) => {
          console.log('error: ' +error);
          switch (error.code) {
            case 'auth/user-not-found':
              this.errorMessage = 'El email no existe en nuestra base de datos.';
              break;
            case 'auth/wrong-password':
              this.errorMessage = 'La contraseña es incorrecta.';
              break;
            case 'auth/invalid-email':
              this.errorMessage = 'El formato del email no es válido.';
              break;
            case 'auth/invalid-credential':
              this.errorMessage = 'Error en los datos.';
              break;
            default:
              this.errorMessage = error.message;
          }
        }
      );
    } else {
      this.errorMessage = 'Por favor, complete todos los campos requeridos correctamente.';
    }
  }
  


  logAdmin() {
    this.loginForm.patchValue({
      email: 'admin@admin.com',
      password: 'utn123'
    });
  }

  logEmpleado() {
    this.loginForm.patchValue({
      email: 'empleado@empleado.com',
      password: '123utn'
    });
  }

  ShowSuccessMessage() {
    this.loginForm.reset();
    this.successMessage = '¡¡¡Bienvenido!!!';
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
