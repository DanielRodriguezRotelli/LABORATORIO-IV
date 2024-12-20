import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetAlert } from '../../clases/sweetAlert';
import { Especialidad } from '../../entidades/especialidad';
import { EspecialidadesService } from '../../services/especialidades.service';
import { EspecialistasService } from '../../services/especialistas.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { PacientesService } from '../../services/pacientes.service';
import { tipoArchivoValidator } from '../../validators/tipoarchivo';
import { Especialista } from '../../entidades/especialista';
import { sendEmailVerification } from '@firebase/auth';
import { Paciente } from '../../entidades/paciente';
import { Subscription } from 'rxjs';
import { TablaPacientesComponent } from '../tabla-pacientes/tabla-pacientes.component';
import { TablaEspecialistasComponent } from '../tabla-especialistas/tabla-especialistas.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Modal } from "bootstrap";
import { Administrador } from '../../entidades/administrador';
import { AdministradoresService } from '../../services/administradores.service';
import { getAuth } from '@angular/fire/auth';
import { getDownloadURL } from '@firebase/storage';
import { NgClass } from '@angular/common';
import { TablaAdministradoresComponent } from '../tabla-administradores/tabla-administradores.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TurnosService } from '../../services/turnos.service';
import * as XLSX from 'xlsx';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [ReactiveFormsModule, TablaPacientesComponent, TablaEspecialistasComponent, SpinnerComponent, NgClass, TablaAdministradoresComponent, NgxSpinnerModule, CapitalizePipe],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css'
})
export class GestionUsuariosComponent implements OnInit, OnDestroy{

  idEspecialistaSeleccionado: string;
  idPacienteSeleccionado: string;
  idAdministradorSeleccionado: string;
  @ViewChild('modalEspecialistaSeleccionado') modalEspecialistaSeleccionado!: ElementRef;
  @ViewChild('modalPacienteSeleccionado') modalPacienteSeleccionado!: ElementRef;
  @ViewChild('modalAdministradorSeleccionado') modalAdministradorSeleccionado!: ElementRef;
  especialistaSeleccionado: Especialista | null;
  pacienteSeleccionado: Paciente | null;
  administradorSeleccionado: Administrador | null;
  formPaciente!: FormGroup;
  formEspecialista!: FormGroup;
  formEspecialidad!: FormGroup;
  formAdministrador!: FormGroup;
  eventoImagen1: any;
  eventoImagen2: any;
  eventoImagenEsp: any;
  eventoImagenAdm: any;
  swal: SweetAlert = new SweetAlert(this.router);
  tipoRegistro: string;
  especialidades: Array<Especialidad>;
  especialidadesObtenidas: boolean;
  obtenerEspecialidadesSub!: Subscription;
  pacienteSeleccionadoCargado: boolean;
  especialistaSeleccionadoCargado: boolean;
  imagen1PacienteSeleccionado: string;
  imagen2PacienteSeleccionado: string;
  imagenEspecialistaSeleccionado: string;
  imagenAdministradorSeleccionado: string;
  administradorSeleccionadoCargado: boolean;
  claseSpinner = "spinner-desactivado";
  suscripcionTurnos!: Subscription;
  turnosPaciente!: Array<any>;
  suscripcionPacientes!: Subscription;
  pacientes!: Paciente[];
  realizoTurno: boolean = false;

  constructor(
    public turnosService: TurnosService,
    public administradoresService: AdministradoresService, 
    public especialidadesService: EspecialidadesService, 
    public fb: FormBuilder, 
    public especialistasService: EspecialistasService, 
    public authService: AuthService, 
    public router: Router, 
    public storageService: StorageService, 
    public pacientesService: PacientesService,
    private spinner: NgxSpinnerService)
  {
    this.imagen1PacienteSeleccionado = "";
    this.imagen2PacienteSeleccionado = "";
    this.imagenEspecialistaSeleccionado = "";
    this.imagenAdministradorSeleccionado = "";
    this.idEspecialistaSeleccionado = "";
    this.idPacienteSeleccionado = "";
    this.idAdministradorSeleccionado = "";
    this.tipoRegistro = "";
    this.especialistaSeleccionado = null;
    this.pacienteSeleccionado = null;
    this.administradorSeleccionado = null;
    this.especialidades = [];
    this.especialidadesObtenidas = false;
    this.pacienteSeleccionadoCargado = false;
    this.especialistaSeleccionadoCargado = false;
    this.administradorSeleccionadoCargado = false;
    this.limpiarEventosImagen();

  }

  ngOnInit(): void
  {
    this.spinner.show();
    this.pacientesService.getPacientes().subscribe({
      next: (res) =>
      {
        this.pacientes = res;
  
      }
    })

    this.formPaciente = this.fb.group({
      dni: ['', [Validators.min(1000000), Validators.required]],
      nombre: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
      apellido: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
      edad: ['', [Validators.min(18), Validators.required]],
      obraSocial: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
      mail: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(6), Validators.required]],
      imagen1: ['', [tipoArchivoValidator(['jpg', 'jpeg', 'png']), Validators.required]],
      imagen2: ['', [tipoArchivoValidator(['jpg', 'jpeg', 'png']), Validators.required]]
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
    })

    this.formEspecialidad = this.fb.group({
      nombre: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]]
    })

    this.formAdministrador = this.fb.group({
      dni: ['', [Validators.min(1000000), Validators.required]],
      nombre: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
      apellido: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
      edad: ['', [Validators.min(18), Validators.required]],
      mail: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(6), Validators.required]],
      imagen: ['', [tipoArchivoValidator(['jpg', 'jpeg', 'png']), Validators.required]],
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

  ngOnDestroy(): void
  {
    if (this.suscripcionTurnos)
    {
      this.suscripcionTurnos.unsubscribe();
    }
    if (this.suscripcionPacientes)
    {
      this.suscripcionPacientes.unsubscribe();
    }
  }
  

  mostrarSpinner()
  {
    this.claseSpinner = "spinner-activado";
  }

  ocultarSpinner()
  {
    this.claseSpinner = "spinner-desactivado";
  }

  
  recibirIdEspecialista(id: string)
  {
    this.especialistaSeleccionadoCargado = false;

    this.idEspecialistaSeleccionado = id;

    this.especialistasService.obtenerEspecialistaPorId(this.idEspecialistaSeleccionado).then((respuesta) =>
    {
      this.especialistaSeleccionado = respuesta;
      console.log(this.especialistaSeleccionado);

      this.storageService.obtenerImagen("especialistas/" + respuesta?.mail).then((url) =>
      {
        if (url)
        {
          this.imagenEspecialistaSeleccionado = url;
          this.especialistaSeleccionadoCargado = true;
        }
      });
    })
    this.mostrarModalEspecialistaSeleccionado();
  }

  recibirIdAdministrador(id: string)
  {
    this.administradorSeleccionadoCargado = false;

    this.idAdministradorSeleccionado = id;

    this.administradoresService.obtenerAdministradorPorId(this.idAdministradorSeleccionado).then((respuesta) =>
    {
      this.administradorSeleccionado = respuesta;
      console.log(this.administradorSeleccionado);

      this.storageService.obtenerImagen("administradores/" + respuesta?.mail).then((url) =>
      {
        if (url)
        {
          this.imagenAdministradorSeleccionado = url;
          this.administradorSeleccionadoCargado = true;
        }
      });
    })
    this.mostrarModalAdministradorSeleccionado();
  }

  recibirIdPaciente(id: string)
  {
    this.pacienteSeleccionadoCargado = false;

    this.idPacienteSeleccionado = id;
    this.pacientesService.obtenerPacientePorId(this.idPacienteSeleccionado).then((respuesta) =>
    {
      this.pacienteSeleccionado = respuesta;
      console.log(this.pacienteSeleccionado);
      Promise.all([
        this.storageService.obtenerImagen(`pacientes/${respuesta?.mail}/1`),
        this.storageService.obtenerImagen(`pacientes/${respuesta?.mail}/2`)
      ])
        .then(([url1, url2]) =>
        {

          if (url1 && url2)
          {
            this.imagen1PacienteSeleccionado = url1;
            this.imagen2PacienteSeleccionado = url2;
            this.pacienteSeleccionadoCargado = true;
          }
        })
    })
    this.mostrarModalPacienteSeleccionado();
  }



  descargarExcelPaciente(dniPaciente: any)
  {
    console.log('turnos: ', this.turnosPaciente);
    console.log('Generando Excel para:', this.pacienteSeleccionado);
    
    if (!this.turnosPaciente || this.turnosPaciente.length === 0) {
      console.error('No hay turnos disponibles para este paciente.');
      return;
    }

    // Prepara los datos para el Excel
    const data = this.turnosPaciente.map(turno => ({
      DNI: this.pacienteSeleccionado?.dni,
      Nombre: this.pacienteSeleccionado?.nombre,
      Apellido: this.pacienteSeleccionado?.apellido,
      'Obra Social': this.pacienteSeleccionado?.obraSocial,
      Mail: this.pacienteSeleccionado?.mail,
      Fecha: turno.fecha,
      Especialidad: turno.especialidad,
      Especialista: `${turno.nombreEspecialista} ${turno.apellidoEspecialista}`,
      'Historia Clínica': Object.entries(turno.historiaClinica || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(', '),
    }));

    // Convierte la tabla a una hoja de Excel
    const ws:  XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Crea un libro de Excel y añade la hoja
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'TurnosPaciente');

     // Genera y descarga el archivo Excel
     XLSX.writeFile(wb, `turnos-paciente-${dniPaciente}.xlsx`);
  }

  descargarExcelPacientes()
  {
    console.log('Pacientes: ',this.pacientes);

    const datos = this.pacientes.map(paciente => ({
      Dni: paciente.dni,
      Nombre: paciente.nombre,
      Apellido: paciente.apellido,
      Email: paciente.mail,
      Edad: paciente.edad,
      ObraSocial: paciente.obraSocial
    }));

    const ws = XLSX.utils.json_to_sheet(datos);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'pacientes.xlsx');
  }

  descargarExcelEspecialistas()
  {
    let data = document.getElementById('tabla-de-especialistas');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'especialistas.xlsx');
  }

  descargarExcelAdministradores()
  {
    let data = document.getElementById('tabla-de-administradores');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'administradores.xlsx');
  }


  

  objectKeys(obj: any)
  {
    return Object.keys(obj);
  }

  mostrarModalEspecialistaSeleccionado()
  {
    const modal: any = new Modal(this.modalEspecialistaSeleccionado.nativeElement);
    modal.show();
  }

  mostrarModalAdministradorSeleccionado()
  {
    const modal: any = new Modal(this.modalAdministradorSeleccionado.nativeElement);
    modal.show();
  }

  mostrarModalPacienteSeleccionado()
  {
    this.mostrarSpinner();
    if (this.suscripcionTurnos)
    {
      this.suscripcionTurnos.unsubscribe();
    }
    this.suscripcionTurnos = this.turnosService.obtenerTurnosByField('idPaciente', this.idPacienteSeleccionado).subscribe({
      next: (res) =>
      {
        this.realizoTurno = false;
        this.turnosPaciente = res;
        this.tieneTurnoRealizado(this.turnosPaciente);
        console.log('realizo turno?: ', this.realizoTurno);
        this.ocultarSpinner();
      }
    })
    const modal: any = new Modal(this.modalPacienteSeleccionado.nativeElement);
    // this.tieneTurnoRealizado(this.turnosPaciente);
    modal.show();
  }

  
  tieneTurnoRealizado(turnosPaciente: Array<any>) :void
  {
    console.log('turnos del paciente: ', this.turnosPaciente);
    for (let i = 0; i < turnosPaciente.length; i++) 
      {
        if (turnosPaciente[i].estado === 'realizado') 
          {
              this.realizoTurno = true;
          }  
      }

  }

  
  aprobarEspecialista(id: string)
  {
    this.especialistasService.aprobarEspecialista(id);
  }

  desaprobarEspecialista(id: string)
  {
    this.especialistasService.desaprobarEspecialista(id);
  }


  cambiarTipoRegistro(tipoRegistro: string)
  {
    this.tipoRegistro = tipoRegistro;
  }

  enviarFormEspecialidad()
  {

    if (this.formEspecialidad.valid)
    {
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

  enviarFormEspecialista()
  {
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
        //this.ocultarSpinner();
        console.log(response);
        this.swal.mostrarMensajeExito("Cuenta creada con exito", "El usuario registrado deberá verificar su mail.");

        // Enviar verificación de mail
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

          // Reseteo de eventos de las imágenes
          this.limpiarEventosImagen();
          // Reseteo del formulario
          this.formPaciente.reset();
          this.formEspecialista.reset();
          this.formAdministrador.reset();

        }).catch(error =>
        {
          this.spinner.hide();
          console.log('Error al subir las imagenes:', error);
          this.swal.mostrarMensajeError("Error", this.authService.traducirErrorCode(error.code));
        });
      }).catch(error =>
      {
        this.spinner.hide();
        console.log(error);
        this.swal.mostrarMensajeError("Error", this.authService.traducirErrorCode(error.code));
      });
    } else
    {
      this.formEspecialista.markAllAsTouched();
    }
  }

  enviarFormAdministrador()
  {
    if (this.formAdministrador.valid)
    {
      this.spinner.show();

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
        // Enviar verificación de mail
        sendEmailVerification(getAuth(this.authService.secondaryApp).currentUser!).then(() =>
        {
          console.log('Verificacion de email enviada');
        }).catch(error =>
        {
          console.log('Error enviando la verificacion de email:', error);
        });

        // Subir imágenes a Firebase Storage
        this.storageService.subirImagen(this.eventoImagenAdm, 'administradores/' + administrador.mail).then(() =>
        {
          console.log('La imagen se subió correctamente.');
          // Guardar datos del especialista en Firestore
          this.administradoresService.guardarAdministrador(administrador);
          console.log(response);
          this.spinner.hide();
          this.swal.mostrarMensajeExito("Cuenta creada con exito", "El usuario registrado deberá verificar su mail.");
          
          // Reseteo de eventos de las imágenes
          this.limpiarEventosImagen();
          // Reseteo del formulario
          this.formPaciente.reset();
          this.formEspecialista.reset();
          this.formAdministrador.reset();

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
    } else
    {
      this.formAdministrador.markAllAsTouched();
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
        sendEmailVerification(getAuth(this.authService.secondaryApp).currentUser!).then(() =>
        {
          console.log('Verificacion de email enviada');
        }).catch(error =>
        {
          console.log('Error enviando la verificacion de email:', error);
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

          Promise.all(promesasGetDownloadUrl).then((urlImagenes) =>
          {
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
            // Guardar datos del paciente en Firestore
            this.pacientesService.guardarPaciente(paciente);
            console.log(response);
            this.spinner.hide();
            this.swal.mostrarMensajeExito("Cuenta creada con exito", "El usuario registrado deberá verificar su mail.");
    
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

  seleccionarEspecialidad(especialidad: string)
  {
    const especialidadesActuales = this.especialidadEspecialista?.value;
    if (especialidadesActuales != "" && especialidadesActuales != null)
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

  //EVENTOS IMAGEN 

  guardarEventoImagen(evento: any, numeroImagen: number)
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
        this.eventoImagenEsp = evento;
        break;
      case 4:
        this.eventoImagenAdm = evento;
        break;
    }
  }

  limpiarEventosImagen()
  {
    this.eventoImagen1 = null;
    this.eventoImagen2 = null;
    this.eventoImagenEsp = null;
  }
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
  get dniAdministrador()
  {
    return this.formAdministrador.get('dni');
  }
  get nombreAdministrador()
  {
    return this.formAdministrador.get('nombre');
  }
  get apellidoAdministrador()
  {
    return this.formAdministrador.get('apellido');
  }
  get edadAdministrador()
  {
    return this.formAdministrador.get('edad');
  }
  get mailAdministrador()
  {
    return this.formAdministrador.get('mail');
  }
  get passwordAdministrador()
  {
    return this.formAdministrador.get('password');
  }
  get imagenAdministrador()
  {
    return this.formAdministrador.get('imagen1');
  }

}