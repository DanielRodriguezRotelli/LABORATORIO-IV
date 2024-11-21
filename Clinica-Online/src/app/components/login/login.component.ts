import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetAlert } from '../../clases/sweetAlert';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { StorageService } from '../../services/storage.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NgClass } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { LogsService } from '../../services/logs.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgxSpinnerModule, SpinnerComponent, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    trigger ('arribaHaciaAbajo', [
      state('arriba', style({
        transform: 'translateY(-2000px)',
        opacity: 0.8,
        overflow: 'hidden'
      })),
      state('abajo', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('arriba => abajo', [animate('2s')]),
    ])
  ]
})
export class LoginComponent implements OnInit{

  public estadoAnimacion: string = 'arriba';
  formLogin!: FormGroup;
  swal: SweetAlert = new SweetAlert(this.router);
  usuariosRapidos: Array<any> = [
    {tipo: "Paciente", mail: "pacienteariadna@gmail.com", password: "123456", imagePath: "pacientes/pacienteariadna@gmail.com/1"},
    {tipo: "Paciente", mail: "pacientemaria@hotmail.com", password: "123456", imagePath: "pacientes/pacientemaria@hotmail.com/1"},
    {tipo: "Paciente", mail: "pacienteantonio@gmail.com", password: "123456", imagePath: "pacientes/pacienteantonio@gmail.com/1"},
    {tipo: "Especialista", mail: "especialistagutierrez@gmail.com", password: "123456", imagePath: "especialistas/especialistagutierrez@gmail.com"},
    {tipo: "Especialista", mail: "doctoraruggero@clinica.com", password: "123456", imagePath: "especialistas/doctoraruggero@clinica.com"},
    {tipo: "Admin", mail: "administrador@gmail.com", password: "123456", imagePath: "administradores/administrador@gmail.com"}
  ];
  imagenesBotonesObtenidas = false;
  claseSpinner = "spinner-desactivado";


  constructor(
    private fb: FormBuilder, 
    protected authService: AuthService, 
    public router: Router, 
    public storageService: StorageService,
    private spinner: NgxSpinnerService,
    private logsService: LogsService) { }
    
  ngOnInit(): void
  {
    setTimeout(() => {
      this.estadoAnimacion = 'abajo';
      
    }, 500);
    
    this.spinner.show();
    this.formLogin = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    })

    for(let i = 0 ; i <this.usuariosRapidos.length ; i++)
    {
      this.storageService.obtenerImagen(this.usuariosRapidos[i].imagePath).then((imagePath) => {
        this.usuariosRapidos[i].imagePath = imagePath;

        console.log(this.usuariosRapidos[i].imagePath);

        if(i == this.usuariosRapidos.length-1)
          {
            this.imagenesBotonesObtenidas =true;
          }
      });
    }

    this.spinner.hide();
  }


  mostrarSpinner()
  {
    this.claseSpinner = "spinner-activado";
  }

  ocultarSpinner()
  {
    this.claseSpinner = "spinner-desactivado";
  }

  
  iniciarSesion()
  {
    this.spinner.show();
    if (this.formLogin.valid)
    {
      this.authService.logIn(this.user?.value, this.password?.value).then((response) =>
      {
        if (response.user.email == 'administrador@gmail.com' || 
            response.user.email == 'pacienteariadna@gmail.com' || 
            response.user.email == 'pacientemaria@hotmail.com' ||
            response.user.email == 'pacienteantonio@gmail.com' ||
            response.user.email == 'doctoraruggero@clinica.com' ||
            response.user.email == 'pacientecesar@argentina.com' ||
            response.user.email == 'daniel.rodriguez.rotelli@gmail.com' ||
            response.user.email == 'especialistagutierrez@gmail.com') {
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
            let log = {email: this.user?.value}
            this.logsService.guardarLog(log);
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

  accesoRapido(usuario: any)
  {
    let user;
    let password;
    user = usuario.mail;
    password = usuario.password;
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