import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SweetAlert } from '../../clases/sweetAlert';
import { EspecialidadesService } from '../../services/especialidades.service';
import { PacientesService } from '../../services/pacientes.service';
import { EspecialistasService } from '../../services/especialistas.service';
import { tipoArchivoValidator } from '../../validators/tipoarchivo';
import { Especialidad } from '../../entidades/especialidad';
import { Especialista } from '../../entidades/especialista';
import { getAuth, sendEmailVerification } from '@angular/fire/auth';
import { Paciente } from '../../entidades/paciente';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { getDownloadURL, Storage } from '@angular/fire/storage';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NgClass } from '@angular/common';
import { AdministradoresService } from '../../services/administradores.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { RecaptchaModule, ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerComponent, NgClass, NgxSpinnerComponent, RecaptchaModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

  formPaciente!: FormGroup;
  formAdministrador!: FormGroup;
  formEspecialista!: FormGroup;
  formEspecialidad!: FormGroup;
  tipoRegistro: string;
  especialidades: Array<Especialidad>;
  especialidadesObtenidas: boolean;
  obtenerEspecialidadesSub!: Subscription;
  userMail: string = "";
  userPassword: string = "";
  confirmPassword: string = "";
  errorMessage: string = "";
  eventoImagen1: any;
  eventoImagen2: any;
  eventoImagenEsp: any;
  claseSpinner = "spinner-desactivado";
  swal: SweetAlert = new SweetAlert(this.router);
  selectedButton!: 'paciente' | 'doctor' | '';

  eventoImagenAdm: any;
  captchaToken: string | null = null;

  constructor( 
    private fb: FormBuilder, 
    public especialidadesService: EspecialidadesService, 
    public storage: Storage, 
    public pacientesService: PacientesService, 
    public especialistasService: EspecialistasService,
    public administradoresServices: AdministradoresService, 
    public authService: AuthService, 
    public storageService: StorageService, 
    public router: Router, 
    private spinner: NgxSpinnerService) {

      this.tipoRegistro = "";
      this.especialidades = [];
      this.especialidadesObtenidas = false;
      this.limpiarEventosImagen();
  }

  ngOnInit(): void
  {
    this.spinner.show();
    this.formPaciente = this.fb.group({
      dni: ['', [Validators.min(1000000), Validators.required]],
      nombre: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
      apellido: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
      edad: ['', [Validators.min(18), Validators.required]],
      obraSocial: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
      mail: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(6), Validators.required]],
      imagen1: ['', [tipoArchivoValidator(['jpg', 'jpeg', 'png']), Validators.required]],
      imagen2: ['', [tipoArchivoValidator(['jpg', 'jpeg', 'png']), Validators.required]],
      captcha: ['', Validators.required]
    })
    this.formAdministrador = this.fb.group({
      dni: ['', [Validators.min(1000000), Validators.required]],
      nombre: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
      apellido: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
      edad: ['', [Validators.min(18), Validators.required]],
      mail: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(6), Validators.required]],
      imagen: ['', [tipoArchivoValidator(['jpg', 'jpeg', 'png']), Validators.required]],
      captcha: ['', Validators.required]
    })
    this.formEspecialista = this.fb.group({
      dni: ['', [Validators.min(1000000), Validators.required]],
      nombre: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
      apellido: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
      edad: ['', [Validators.min(18), Validators.required]],
      especialidad: ['', Validators.required],
      mail: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(6), Validators.required]],
      imagen: ['', [tipoArchivoValidator(['jpg', 'jpeg', 'png']), Validators.required]],
      captcha: ['', Validators.required]
    })
    this.formEspecialidad = this.fb.group({
      nombre: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]]
    })
    this.especialidadesService.obtenerEspecialidades();
    this.obtenerEspecialidadesSub = this.especialidadesService.obtenerEspecialidadesSubject.subscribe(status =>
    {
      if (status)
      {
        this.especialidades = this.especialidadesService.coleccionEspecialidades;
        console.log("especialidades obtenidas");
        this.especialidadesObtenidas = true;
      }
    })
    this.spinner.hide();
  }

  ejecutarCaptchaEspecialista(token: any)
  {
    this.formEspecialista.patchValue({
      captcha: token
    });
    this.captchaToken = token;
  }

  ejecutarCaptchaPaciente(token: any)
  {
    this.formPaciente.patchValue({
      captcha: token
    });
    this.captchaToken = token;
  }


  cambiarTipoRegistro(tipoRegistro: string)
  {
    this.tipoRegistro = tipoRegistro;
    this.formEspecialidad.reset();
    this.formPaciente.reset();
    this.selectedButton = tipoRegistro === 'paciente' ? 'paciente' : 'doctor';
    console.log('eligió: ' + this.selectedButton);
  }

  //ENVIAR FORMS 
  enviarFormEspecialidad() {
    if (this.formEspecialidad.valid) {
      const nuevaEspecialidad: Especialidad = {nombre: this.nombreEspecialidad?.value};

      console.log('especialidad: ' + nuevaEspecialidad.nombre);

      let especialidadExistente = this.especialidades.some(especialidad =>
        nuevaEspecialidad.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === 
        especialidad.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      );
  
      if (especialidadExistente) {
        this.swal.mostrarMensajeError("Error", "Esa especialidad ya está en la lista");
      } else {
        this.especialidadesService.guardarEspecialidad(nuevaEspecialidad);
        this.formEspecialidad.reset();
        this.swal.mostrarMensajeExito("Éxito", "La especialidad ha sido guardada correctamente.");
      }
    } else {
      this.formEspecialidad.markAllAsTouched();
    }
  }
  

  enviarFormEspecialista() {
    if (this.formEspecialista.valid)
    {
      this.spinner.show();

      let especialista: Especialista = {
        dni: this.dniEspecialista?.value,
        nombre: this.nombreEspecialista?.value,
        apellido: this.apellidoEspecialista?.value,
        edad: this.edadEspecialista?.value,
        especialidades: this.especialidadEspecialista?.value.split(", "),
        mail: this.mailEspecialista?.value,
        password: this.passwordEspecialista?.value
      };

      // Registro del usuario
      this.authService.registerSinLogin(especialista.mail, especialista.password).then(response =>
      {
        // Enviar verificación de mail
        const auth = getAuth();
        sendEmailVerification(getAuth(this.authService.secondaryApp).currentUser!).then(() =>
        {
          console.log('Verificacion de email enviada');
        }).catch(error =>
        {
          console.log('Error enviando la verificacion de email:', error);
        });

        // Subir imágenes a Firebase Storage
        this.storageService.subirImagen(this.eventoImagenEsp, 'especialistas/' + especialista.mail).then(() =>
        {
          console.log('La imagene se subió correctamente.');

          // Guardar datos del especialista en Firestore
          this.especialistasService.guardarEspecialista(especialista);
          console.log(response);
          this.spinner.hide();
          this.swal.mostrarMensajeExitoYNavegar("Cuenta creada con exito", "A continuación, debe verificar su mail y esperar que un administrador apruebe su cuenta. Revise su bandeja de entrada.", "bienvenida");
          
          // Reseteo de eventos de las imágenes
          this.limpiarEventosImagen();
          // Reseteo del formulario
          this.formPaciente.reset();
          this.formEspecialista.reset();
        }).catch(error =>
        {
          this.spinner.hide();
          console.log('Error al subir las imagenes:', error);
        });
      }).catch(error =>
      {
        this.spinner.hide();
        console.log(error);
        this.swal.mostrarMensajeError("Error", this.authService.traducirErrorCode(error.code));
      });
    } 
    else
    {
      this.formEspecialista.markAllAsTouched();
    }
  }

  enviarFormPaciente()
  {
    if (this.formPaciente.valid)
    {
      this.spinner.show();

      // Registro del usuario
      this.authService.registerSinLogin(this.mailPaciente?.value, this.passwordPaciente?.value).then(response =>
      {
        // Enviar verificación de mail
        const auth = getAuth();
        sendEmailVerification(getAuth(this.authService.secondaryApp).currentUser!).then(() =>
        {
          console.log('Verificacion de email enviada');
          this.authService.LogOut();
        }).catch(error =>
        {
          console.log('Error enviando la verificacion de email:', error);
          this.authService.LogOut();
        });

        // Subir imágenes a Firebase Storage
        const promesasUpload = [];
        promesasUpload.push(this.storageService.subirImagen(this.eventoImagen1, 'pacientes/' + this.mailPaciente?.value + '/1'));
        promesasUpload.push(this.storageService.subirImagen(this.eventoImagen2, 'pacientes/' + this.mailPaciente?.value + '/2'));

        Promise.all(promesasUpload).then((uploadResults) =>
        {
          const [uploadResult1, uploadResult2] = uploadResults;

          const promesasGetDownloadUrl = [];
          promesasGetDownloadUrl.push(getDownloadURL(uploadResult1.ref));
          promesasGetDownloadUrl.push(getDownloadURL(uploadResult2.ref));

          Promise.all(promesasGetDownloadUrl).then((urlImagenes) => {
            const [urlImagen1, urlImagen2] = urlImagenes;
            let paciente: Paciente = {
              dni: this.dniPaciente?.value,
              nombre: this.nombrePaciente?.value,
              apellido: this.apellidoPaciente?.value,
              edad: this.edadPaciente?.value,
              obraSocial: this.obraSocialPaciente?.value,
              mail: this.mailPaciente?.value,
              password: this.passwordPaciente?.value,
              urlImagen1: urlImagen1,
              urlImagen2: urlImagen2
            };
            console.log('Las imagenes se subieron correctamente.');

            if (this.captchaToken) {
              // Aquí procesas el formulario junto con el token de CAPTCHA
               // Guardar datos del paciente en Firestore
              this.pacientesService.guardarPaciente(paciente);
              console.log(response);
              this.spinner.hide();
              this.swal.mostrarMensajeExitoYNavegar("Cuenta creada con exito", "A continuación, debe verificar su mail. Revise su bandeja de entrada.", "bienvenida");
              console.log('Formulario válido con CAPTCHA token:', this.captchaToken);
            } else {
              console.error('Captcha no resuelto');
            }
           
            // Reseteo de eventos de las imágenes
            this.limpiarEventosImagen();
            // Reseteo del formulario
            this.formPaciente.reset();
            this.formEspecialista.reset();
          })
            
        }).catch(error =>
        {
          console.log('Error al subir las imagenes:', error);
        });
      }).catch(error =>
      {
        this.spinner.hide();
        console.log(error);
        this.swal.mostrarMensajeError("Error", this.authService.traducirErrorCode(error.code));
      });
    } else
    {
      this.formPaciente.markAllAsTouched();
    }
  }

  /*
  enviarFormAdministrador()
  {
    if (this.formAdministrador.valid)
    {
      // Registro del usuario
      
      let administrador: Administrador = {
        dni: this.dniAdministrador?.value,
        nombre: this.nombreAdministrador?.value,
        apellido: this.apellidoAdministrador?.value,
        edad: this.edadAdministrador?.value,
        mail: this.mailAdministrador?.value,
        password: this.passwordAdministrador?.value,
        imagen: this.imagenAdministrador?.value
      };

      // Registro del usuario
      this.authService.registerSinLogin(administrador.mail, administrador.password).then(response =>
      {
        console.log(response);
        //this.ocultarSpinner();
        this.swal.mostrarMensajeExitoYNavegar("Cuenta creada con exito", "A continuación, debe verificar su mail y esperar que un administrador apruebe su cuenta. Revise su bandeja de entrada.", "bienvenida");

        
        // Subir imágenes a Firebase Storage

        this.storageService.subirImagen(this.eventoImagenAdm, 'administradores/' + administrador.mail).then(() =>
        {
          console.log('La imagene se subió correctamente.');
          // Guardar datos del especialista en Firestore
          this.administradoresServices.guardarAdministrador(administrador);
          // Reseteo de eventos de las imágenes
          this.limpiarEventosImagen();
          // Reseteo del formulario
          this.formAdministrador.reset();
          this.formPaciente.reset();
          this.formEspecialista.reset();
        }).catch(error =>
        {
          console.log('Error al subir las imagenes:', error);
        });
      }).catch(error =>
      {
        //this.ocultarSpinner();
        console.log(error);
        this.swal.mostrarMensajeError("Error", this.authService.traducirErrorCode(error.code));
      });
    } 
    else
    {
      this.formAdministrador.markAllAsTouched();
    }
  }
  */

  //SELECCIONAR ESPECIALIDAD
  seleccionarEspecialidad(especialidad: string)
  {
    const especialidadesActuales = this.especialidadEspecialista?.value;

    if (especialidadesActuales != "")
    {
      const especialidadesLista = especialidadesActuales.split(", ");

      if (especialidadesLista.includes(especialidad))
      {
        return;
      }

      if (especialidad == "")
      {
        this.formEspecialista.patchValue({
          especialidad: especialidad
        });
      } else
      {
        this.formEspecialista.patchValue({
          especialidad: (especialidadesActuales + ", " + especialidad),
        });
      }
    } else
    {
      this.formEspecialista.patchValue({
        especialidad: especialidad
      });
    }

  }

  //EVENTOS 
  guardarEventoImagen(evento: any, numeroImagen?: number)
  {
    switch (numeroImagen)
    {
      case 1:
        this.eventoImagen1 = evento;
        break;
      case 2:
        this.eventoImagen2 = evento;
        break;
      case 3:
        this.eventoImagenAdm = evento;
        break;
      case 4:
        this.eventoImagenEsp = evento;
        break;
    }
  }

  limpiarEventosImagen()
  {
    this.eventoImagen1 = null;
    this.eventoImagen2 = null;
    this.eventoImagenEsp = null;
    this.eventoImagenAdm = null;
  }

  //MOSTRAR MENSAJES 
  //GETTERS
  get dniPaciente()
  {
    return this.formPaciente.get('dni');
  }
  get nombrePaciente()
  {
    return this.formPaciente.get('nombre');
  }
  get apellidoPaciente()
  {
    return this.formPaciente.get('apellido');
  }
  get edadPaciente()
  {
    return this.formPaciente.get('edad');
  }
  get obraSocialPaciente()
  {
    return this.formPaciente.get('obraSocial');
  }
  get mailPaciente()
  {
    return this.formPaciente.get('mail');
  }
  get passwordPaciente()
  {
    return this.formPaciente.get('password');
  }
  get imagen1Paciente()
  {
    return this.formPaciente.get('imagen1');
  }
  get imagen2Paciente()
  {
    return this.formPaciente.get('imagen2');
  }
  get dniEspecialista()
  {
    return this.formEspecialista.get('dni');
  }
  get nombreEspecialista()
  {
    return this.formEspecialista.get('nombre');
  }
  get apellidoEspecialista()
  {
    return this.formEspecialista.get('apellido');
  }
  get edadEspecialista()
  {
    return this.formEspecialista.get('edad');
  }
  get especialidadEspecialista()
  {
    return this.formEspecialista.get('especialidad');
  }
  get mailEspecialista()
  {
    return this.formEspecialista.get('mail');
  }
  get passwordEspecialista()
  {
    return this.formEspecialista.get('password');
  }
  get imagenEspecialista()
  {
    return this.formEspecialista.get('imagen');
  }
  get nombreEspecialidad()
  {
    return this.formEspecialidad.get('nombre');
  }

  // Métodos para acceder a los controles
get dniAdministrador() {
  return this.formAdministrador.get('dni');
}

get nombreAdministrador() {
  return this.formAdministrador.get('nombre');
}

get apellidoAdministrador() {
  return this.formAdministrador.get('apellido');
}

get edadAdministrador() {
  return this.formAdministrador.get('edad');
}

get mailAdministrador() {
  return this.formAdministrador.get('mail');
}

get passwordAdministrador() {
  return this.formAdministrador.get('password');
}

get imagenAdministrador() {
  return this.formAdministrador.get('imagen');
}
}


