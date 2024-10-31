import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetAlert } from '../../clases/sweetAlert';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { StorageService } from '../../services/storage.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  formLogin!: FormGroup;
  swal: SweetAlert = new SweetAlert(this.router);
  imagenesBotonesObtenidas = false;


  constructor(
    private fb: FormBuilder, 
    protected authService: AuthService, 
    public router: Router, 
    public storageService: StorageService,
    private spinner: NgxSpinnerService) { }
    
  ngOnInit(): void
  {
    this.spinner.show();
    this.formLogin = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    })
    this.spinner.hide();
  }

  
  iniciarSesion()
  {
    this.spinner.show();
    if (this.formLogin.valid)
    {
      this.authService.logIn(this.user?.value, this.password?.value).then((response) =>
      {
        if (response.user.email == 'administrador@gmail.com' || response.user.email == 'pacienteariadna@gmail.com' || response.user.email == 'cardiologogutierrez@gmail.com') {
          console.log(response);
          let log = {
            email: this.user?.value
          }
          //this.logsService.guardarLog(log);
          this.swal.mostrarMensajeExitoYNavegar("Sesión iniciada", "Serás redirigido a la página de bienvenida", "bienvenida");
          this.spinner.hide();
        }
        else{
          if(response.user.emailVerified == false){

            this.authService.LogOut();
            this.swal.mostrarMensajeWarning("Mail no verificado", "Para iniciar sesión con esta cuenta, debe verificar su email. Por favor revise su bandeja de entrada.");
            this.spinner.hide();
          }
          else{
            console.log(response);
            let log = {
              email: this.user?.value
            }
            //this.logsService.guardarLog(log);
            this.swal.mostrarMensajeExitoYNavegar("Sesión iniciada", "Serás redirigido a la página de bienvenida", "bienvenida");
            this.spinner.hide();
          }
        }
      }).catch((error) =>
      {
        console.log(error);
        this.swal.mostrarMensajeError("Error", this.authService.traducirErrorCode(error.code));
        this.spinner.hide();

      })
    }
  }


  accesoRapido(opcion: string)
  {
    let user;
    let password;
    switch (opcion)
    {
      case "paciente":
        user = "pacienteariadna@gmail.com";
        password = "123456";
        break;
      case "especialista":
        user = "cardiologogutierrez@gmail.com";
        password = "999999";
        
        break;
      case "administrador":
        user = "administrador@gmail.com";
        password = "123456";
        break;
    }
    this.formLogin.patchValue({ user: user, password: password })
  }

  get user()
  {
    return this.formLogin.get('user');
  }

  get password()
  {
    return this.formLogin.get('password');
  }
}