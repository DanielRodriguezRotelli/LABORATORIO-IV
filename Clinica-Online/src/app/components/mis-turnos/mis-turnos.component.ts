import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Tiempo } from '../../clases/tiempo';
import { Especialidad } from '../../entidades/especialidad';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetAlert } from '../../clases/sweetAlert';
import { PacientesService } from '../../services/pacientes.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { EspecialistasService } from '../../services/especialistas.service';
import { EspecialidadesService } from '../../services/especialidades.service';
import { TurnosService } from '../../services/turnos.service';
import { Modal } from 'bootstrap';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { TablaEspecialistasComponent } from '../tabla-especialistas/tabla-especialistas.component';
import { TablaPacientesComponent } from '../tabla-pacientes/tabla-pacientes.component';
import { MinutosAHoraPipe } from '../../pipes/minutos-ahora.pipe';
import { SpinnerComponent } from '../spinner/spinner.component';
import { EstadoTurnoDirective } from '../../directives/estado-turno.directive';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf, NgFor, FormsModule, TablaEspecialistasComponent, TablaPacientesComponent, MinutosAHoraPipe, SpinnerComponent, EstadoTurnoDirective],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css'
})
export class MisTurnosComponent implements OnInit, OnDestroy {

  public tiempo: Tiempo = new Tiempo();
  public turnos!: Array<any> | null;
  public especialidades!: Array<Especialidad>
  public obtenerEspecialidadesSub!: Subscription;
  public especialidadSeleccionada!: string;
  public especialistaSeleccionado!: string;
  public pacienteSeleccionado!: string;
  public fechaSeleccionada!: string;
  public horaSeleccionada!: string;
  public estadoSeleccionado!: string;
  public pesoSeleccionado!: string;
  public alturaSeleccionada!: string;
  public temperaturaSeleccionada!: string;
  public presionSeleccionada!: string;
  public datosDinamicoSeleccionados = [{ setted: false, clave: '', valor: '' }, { setted: false, clave: '', valor: '' }, { setted: false,clave: '', valor: '' }];
  public hayTurnos = false;
  public turnosListos = false;
  public autenticacionLista = false;
  @ViewChild('modalFiltroEspecialidades') modalFiltroEspecialidades!: ElementRef;
  @ViewChild('modalFiltroEspecialistas') modalFiltroEspecialistas!: ElementRef;
  @ViewChild('modalFiltroPacientes') modalFiltroPacientes!: ElementRef;

  @ViewChild('modalAccionesTurno') modalAccionesTurno!: ElementRef;
  public mostrarBotonesAcciones = {
    cancelar: false,
    verCalificacion: false,
    completarEncuesta: false,
    calificarAtencion: false,
    rechazarTurno: false,
    aceptarTurno: false,
    finalizarTurno: false,
    completarHistoriaClinica: false,
    verResena: false,
    verHistoriaClinica: false,
  }
  public turnoSeleccionado!: any;
  public filtrosActivos: { [key: string]: string } = {};
  public claseSpinner = "spinner-desactivado";
  public suscripcionActual!: Subscription;
  public motivosCancelacion!: string | null;
  public motivosRechazo!: string | null;
  public datosResena!: string | null;
  public preguntasEncuesta =
    [
      { number: 1, question: '¿Ha tenido una buena experiencia con la clinica?' },
      { number: 2, question: '¿El personal cumplió su trabajo de forma eficiente?' },
      { number: 3, question: '¿Volvería a pedir un turno en nuestra clínica?' },
      { number: 4, question: '¿Está satisfecha/o con el trato del médico en la consulta?' },
      { number: 5, question: '¿El tiempo de espera a la consulta fue razonable?' },
      { number: 6, question: '¿Las instalaciones cumplen lo esperado?' }
    ]

  public estrellas = [false, false, false, false, false];
  public datosDinamicos: Array<any> = [false, false, false];
  public datosDinamicosFiltros = [false, false, false];
  public formEncuesta!: FormGroup;
  public formCalificacion!: FormGroup;
  public formHistoriaClinica!: FormGroup;
  public historiaClinicaCompleta: boolean = false;

  public swal: SweetAlert = new SweetAlert(this.router);


  constructor(
    public pacientesService: PacientesService, 
    public authService: AuthService, 
    public router: Router, 
    public fb: FormBuilder, 
    public especialistasService: EspecialistasService, 
    public turnosService: TurnosService, 
    public especialidadesService: EspecialidadesService) {}

  ngOnInit(): void {
    console.log('Entrando en OnInit del componente');
    this.mostrarSpinner();
    this.authService.esperarCargarUsuario().then(() => {
      console.log('Autenticación completada. Ocultando spinner y continuando');
      this.ocultarSpinner();
      this.autenticacionLista = true;

      console.log('Estado de usuarioLogeado:', this.authService.usuarioLogeado);
      if (this.authService.usuarioLogeado && this.authService.usuarioLogeado.id) {
        this.traerTurnos();
      } else {
        console.error('usuarioLogeado o su ID son undefined.');
      }

      this.traerTurnos();
      this.especialidadesService.obtenerEspecialidades();
      this.obtenerEspecialidadesSub = this.especialidadesService.obtenerEspecialidadesSubject.subscribe(status => {
        console.log("Estado de obtenerEspecialidadesSubject:", status); // Verificar el estado de especialidades
        if (status) {
          this.especialidades = this.especialidadesService.coleccionEspecialidades;
        }
      });
  
      // Crear formularios
      this.formEncuesta = this.fb.group({
        question1: ['', [Validators.required]],
        question2: ['', [Validators.required]],
        question3: ['', [Validators.required]],
        question4: ['', [Validators.required]],
        question5: ['', [Validators.required]],
        question6: ['', [Validators.required]],
      });
      this.formCalificacion = this.fb.group({
        comentario: ['', [Validators.required]],
        estrellas: ['', [Validators.required]]
      });
      this.formHistoriaClinica = this.fb.group({
        altura: ['', [Validators.required, Validators.min(1)]],
        peso: ['', [Validators.required, Validators.min(1)]],
        temperatura: ['', [Validators.required, Validators.min(1)]],
        presion: ['', [Validators.required, Validators.min(1)]],
        claveDinamica1: [''],
        valorDinamico1: [''],
        claveDinamica2: [''],
        valorDinamico2: [''],
        claveDinamica3: [''],
        valorDinamico3: [''],
      });

    }).catch(error => {
      console.error("Error en esperarCargarUsuario:", error); // Manejo de errores
      this.ocultarSpinner();
    });
  }
    

  ngOnDestroy(): void
  {
    if (this.suscripcionActual)
    {
      this.suscripcionActual.unsubscribe();
    }
    if(this.obtenerEspecialidadesSub)
    {
      this.obtenerEspecialidadesSub.unsubscribe();
    }
  }
  
  traerTurnos()
  {
    this.mostrarSpinner();
    if (this.suscripcionActual)
    {
      this.suscripcionActual.unsubscribe();
    }
    if (this.authService.tipoUsuario != "administrador")
    {
      let campoId;
      if (this.authService.tipoUsuario == "paciente")
      {
        campoId = "idPaciente";
      }
      else
      {
        campoId = "idEspecialista";
      }
      console.log('usuarioLogeado.id:', this.authService.usuarioLogeado.id);
      this.suscripcionActual = this.turnosService.obtenerTurnosByField(campoId, this.authService.usuarioLogeado.id).subscribe({
        next: (res) =>
        {
          this.turnos = res;
          this.turnosListos = true;
          if (res.length > 0)
          {
            this.hayTurnos = true;
          }
          else
          {
            this.hayTurnos = false;
          }
          this.ocultarSpinner();
        }
      });
    }
    else
    {
      this.suscripcionActual = this.turnosService.getTurnos().subscribe({
        next: (res) =>
        {
          this.turnos = res;
          this.turnosListos = true;
          if (res.length > 0)
          {
            this.hayTurnos = true;
          }
          else
          {
            this.hayTurnos = false;
          }
          this.ocultarSpinner();
        }
      })
    }
  }

  mostrarModalFiltroEspecialidades()
  {
    const modal: any = new Modal(this.modalFiltroEspecialidades.nativeElement);
    modal.show();
  }
  
  mostrarModalFiltroEspecialistas()
  {
    const modal: any = new Modal(this.modalFiltroEspecialistas.nativeElement);
    modal.show();
  }

  mostrarModalFiltroPacientes()
  {
    const modal: any = new Modal(this.modalFiltroPacientes.nativeElement);
    modal.show();
  }

  
  mostrarModalAccionesTurno(turno: any)
  {
    this.turnoSeleccionado = turno;
    this.mostrarBotonesAcciones = {
      cancelar: false,
      verCalificacion: false,
      completarEncuesta: false,
      calificarAtencion: false,
      rechazarTurno: false,
      aceptarTurno: false,
      finalizarTurno: false,
      completarHistoriaClinica: false,
      verResena: false,
      verHistoriaClinica: false,
    }
    console.log(turno);
    this.formCalificacion.reset();
    this.formEncuesta.reset();
    this.estrellas.forEach((estrella, i) =>
    {
      this.estrellas[i] = false;
    });

    if (turno.estado == "pendiente")
    {
      this.mostrarBotonesAcciones.cancelar = true;
    }
    if (turno.calificacion && this.authService.tipoUsuario != "administrador")
    {
      this.mostrarBotonesAcciones.verCalificacion = true;
    }
    if (turno.estado == "realizado" && this.authService.tipoUsuario == "paciente")
    { 
      if (!turno.calificacion) {
        this.mostrarBotonesAcciones.calificarAtencion = true;
      }
      if (!turno.encuesta) {
        this.mostrarBotonesAcciones.completarEncuesta = true;
      }
    }
    if (turno.estado == "realizado" && !turno.calificacion && this.authService.tipoUsuario == "paciente")
    {
      //estrellas + comentario
      this.mostrarBotonesAcciones.calificarAtencion = true;
    }
    if (turno.estado == "pendiente" && this.authService.tipoUsuario == "especialista")
    {
      this.mostrarBotonesAcciones.rechazarTurno = true;
      this.mostrarBotonesAcciones.aceptarTurno = true;
    }
    if (turno.estado == "aceptado" && this.authService.tipoUsuario == "especialista")
    {
      this.mostrarBotonesAcciones.finalizarTurno = true;
    }

    if (turno.estado == "realizado" && this.authService.tipoUsuario == "especialista" && !turno.historiaClinica) {
      this.mostrarBotonesAcciones.completarHistoriaClinica = true;
    }
    
    if(turno.estado == "realizado" && turno.resena && turno.historiaClinica)
    {
      this.mostrarBotonesAcciones.verResena = true;
      this.mostrarBotonesAcciones.verHistoriaClinica = true;
    }

    console.log(this.mostrarBotonesAcciones);
    const modal: any = new Modal(this.modalAccionesTurno.nativeElement);
    modal.show();
  }

  cancelarTurno()
  {
    this.mostrarSpinner();

    if (this.motivosCancelacion)
    {

      this.turnosService.cancelarTurno(this.turnoSeleccionado.id, this.motivosCancelacion).then(() =>
      {
        this.ocultarSpinner();
        this.swal.mostrarMensajeExito(`¡Turno cancelado con éxito!`, 'Presione Ok para continuar');

        this.motivosCancelacion = null;
      });
    }
  }

  rechazarTurno()
  {
    this.mostrarSpinner();

    if (this.motivosRechazo)
    {

      this.turnosService.rechazarTurno(this.turnoSeleccionado.id, this.motivosRechazo).then(() =>
      {
        this.ocultarSpinner();
        this.swal.mostrarMensajeExito(`¡Turno rechazado con éxito!`, 'Presione Ok para continuar');

        this.motivosRechazo = null;
      });
    }
  }

  

  cambiarEstadoTurno(estado: string)
  {
    this.mostrarSpinner();

    this.turnosService.setTurnoField(this.turnoSeleccionado.id, "estado", estado).then(() =>
    {
      this.swal.mostrarMensajeExito(`¡Ahora el turno está ${estado}!`, 'Presione Ok para continuar');

      this.ocultarSpinner();
    })
  }


  enviarEncuesta()
  {
    this.mostrarSpinner();
    let encuesta = {
      question1: this.question1?.value,
      question2: this.question2?.value,
      question3: this.question3?.value,
      question4: this.question4?.value,
      question5: this.question5?.value,
      question6: this.question6?.value
    }
    console.log(encuesta);
    this.turnosService.setTurnoField(this.turnoSeleccionado.id, 'encuesta', encuesta).then(() =>
    {
      this.swal.mostrarMensajeExito('¡Encuesta enviada con éxito!', 'Presione Ok para continuar');
      this.ocultarSpinner();
    })
  }

  enviarCalificacion()
  {
    this.mostrarSpinner();
    this.turnosService.calificarTurno(this.turnoSeleccionado.id, this.comentarioCalificacion?.value, this.estrellasCalificacion?.value).then(() =>
    {
      this.swal.mostrarMensajeExito('¡Calificación enviada con éxito!', 'Presione Ok para continuar');
      this.ocultarSpinner();
    })
  }

  establecerEstrellas(indice: number)
  {
    this.estrellas.forEach((estrella, i) =>
    {
      this.estrellas[i] = false;

    })


    this.estrellas.forEach((estrella, i) =>
    {
      if (i <= indice)
      {
        this.estrellas[i] = !this.estrellas[i];
      }
    });

    this.formCalificacion.patchValue({
      estrellas: indice + 1
    })
  }

  limpiarFiltros()
  {
    this.filtrosActivos = {};
    this.especialidadSeleccionada = '';
    this.especialistaSeleccionado = '';
    this.pacienteSeleccionado = '';
    this.fechaSeleccionada = '';
    this.horaSeleccionada = '';
    this.estadoSeleccionado = '';
    this.pesoSeleccionado = '';
    this.alturaSeleccionada = '';
    this.temperaturaSeleccionada = '';
    this.presionSeleccionada = '';
    this.valorBusquedaGlobal ='';

    for(let i=0 ; i<this.datosDinamicosFiltros.length ; i++)
    {
      this.datosDinamicosFiltros[i] = false;
    }
    for(let i=0 ; i<this.datosDinamicoSeleccionados.length ; i++)
    {
      this.datosDinamicoSeleccionados[i].clave = '';
      this.datosDinamicoSeleccionados[i].valor = '';
      this.datosDinamicoSeleccionados[i].setted = false;
    }

    this.traerTurnos();
  }

  establecerFiltro(filter: string, field: any)
  {
    switch (filter)
    {
      case 'especialidad':
        this.especialidadSeleccionada = field;
        break;
      case 'idEspecialista':
        console.log(field);
        this.especialistasService.obtenerEspecialistaPorId(field).then((res) =>
        {
          this.especialistaSeleccionado = `${res?.nombre} ${res?.apellido}`
        });
        break;
      case 'idPaciente':
        console.log(field);
        this.pacientesService.obtenerPacientePorId(field).then((res) =>
        {
          this.pacienteSeleccionado = `${res?.nombre} ${res?.apellido}`
        });
        break;
        case 'hora':
          field = this.tiempo.horaAMinutos(field);
        break;
    }

    console.log(`${filter}:${field}`)
    this.filtrosActivos[filter] = field;

    const fields = Object.keys(this.filtrosActivos);
    const values = Object.values(this.filtrosActivos);

    this.filtrarTurnos(fields, values);
  }


  setearClaveDinamica(indice: number)
  {
    this.datosDinamicoSeleccionados[indice].setted = true;
  }

  filtrarTurnos(fields: string[], values: string[])
  {
    this.turnosListos = false;
    this.mostrarSpinner();
    if(this.suscripcionActual)
    {
      this.suscripcionActual.unsubscribe();
    }

    let metodo;
    if (this.authService.tipoUsuario == "paciente")
    {

      console.log(this.authService.usuarioLogeado.id)
      this.suscripcionActual = this.turnosService.obtenerTurnosPorPacienteYFields(this.authService.usuarioLogeado.id, fields, values).subscribe({
        next: (res) =>
        {
          this.turnos = res;
          this.turnosListos = true;
          if (res.length > 0)
          {
            this.hayTurnos = true;
          }
          else
          {
            this.hayTurnos = false;
          }
          this.ocultarSpinner();
        }
      });

    }
    else if (this.authService.tipoUsuario == "especialista")
    {

      console.log(this.authService.usuarioLogeado.id)
      this.suscripcionActual = this.turnosService.obtenerTurnosPorEspecialistaYFields(this.authService.usuarioLogeado.id, fields, values).subscribe({
        next: (res) =>
        {
          this.turnos = res;
          this.turnosListos = true;
          if (res.length > 0)
          {
            this.hayTurnos = true;
          }
          else
          {
            this.hayTurnos = false;
          }
          this.ocultarSpinner();
        }
      });
    }
    else if (this.authService.tipoUsuario == "administrador")
    {
      this.suscripcionActual = this.turnosService.obtenerTurnosPorFields(fields, values).subscribe({
        next: (res) =>
        {
          this.turnos = res;
          this.turnosListos = true;
          if (res.length > 0)
          {
            this.hayTurnos = true;
          }
          else
          {
            this.hayTurnos = false;
          }
          this.ocultarSpinner();
        }
      })
    }

  }


  valorBusquedaGlobal: string = '';

  filtrarPorBusquedaGlobal() {
    if (!this.valorBusquedaGlobal || !this.turnosListos) {
      return;
    }
  
    const valorBusqueda = this.valorBusquedaGlobal.toLowerCase().trim();
  
    // Filtros personalizados para cada tipo de usuario
    if (this.authService.tipoUsuario === "paciente") {
      this.suscripcionActual = this.turnosService.obtenerTurnosPorPaciente(this.authService.usuarioLogeado.id).subscribe({
        next: (turnos) => {
          this.turnos = turnos.filter(turno => this.cumpleBusquedaGlobal(turno, valorBusqueda));
          this.turnosListos = true;
          this.hayTurnos = this.turnos.length > 0;
          this.ocultarSpinner();
        }
      });
    } else if (this.authService.tipoUsuario === "especialista") {
      this.suscripcionActual = this.turnosService.obtenerTurnosPorEspecialista(this.authService.usuarioLogeado.id).subscribe({
        next: (turnos) => {
          this.turnos = turnos.filter(turno => this.cumpleBusquedaGlobal(turno, valorBusqueda));
          this.turnosListos = true;
          this.hayTurnos = this.turnos.length > 0;
          this.ocultarSpinner();
        }
      });
    } else if (this.authService.tipoUsuario === "administrador") {
      this.suscripcionActual = this.turnosService.obtenerTodosLosTurnos().subscribe({
        next: (turnos) => {
          this.turnos = turnos.filter(turno => this.cumpleBusquedaGlobal(turno, valorBusqueda));
          this.turnosListos = true;
          this.hayTurnos = this.turnos.length > 0;
          this.ocultarSpinner();
        }
      });
    }
  }

  cumpleBusquedaGlobal(turno: any, valorBusqueda: string): boolean 
  {
    console.log('valor ingresado: ',valorBusqueda);

    if (!valorBusqueda) return true; // Si no hay búsqueda, no filtramos
  
    valorBusqueda = valorBusqueda.toLowerCase().trim(); // Normaliza el valor de búsqueda
  
    // Función para convertir el valor de minutos a formato "hh:mm"
    const convertirAHora = (minutos: number): string => {
      const horas = Math.floor(minutos / 60);
      const minutosRestantes = minutos % 60;
      return `${String(horas).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}`;
    };


    const campos = [
      turno.especialidad?.toLowerCase(),
      turno.nombreEspecialista?.toLowerCase(),
      turno.apellidoEspecialista?.toLowerCase(),
      turno.nombrePaciente?.toLowerCase(),
      turno.apellidoPaciente?.toLowerCase(),
      turno.estado?.toLowerCase(),
      turno.fecha?.toString(),
      turno.hora? convertirAHora(turno.hora) : '', 
      turno.historiaClinica?.peso?.toString() ?? '',
      turno.historiaClinica?.altura?.toString() ?? '',
      turno.historiaClinica?.presion?.toString() ?? '',
      turno.historiaClinica?.temperatura?.toString() ?? '',
      turno.resena?.toLowerCase() ?? '',
    ];
  
    // Imprime los campos para verificar
    console.log('Campos a evaluar:', campos);

    // Verificar si la búsqueda coincide con las claves o valores dinámicos en historiaClinica
    if (turno.historiaClinica) {
      for (const [clave, valor] of Object.entries(turno.historiaClinica)) {
        const claveString = clave.toLowerCase();
        const valorString = valor?.toString().toLowerCase() ?? '';  // Convertimos el valor a string

        // Comparamos si la clave o el valor contiene el valor de búsqueda
        if (claveString.includes(valorBusqueda) || valorString.includes(valorBusqueda)) {
          return true;
        }
      }
    }
  
     // Recorremos los campos y verificamos si alguno contiene la cadena de búsqueda
    return campos.some(campo => {
      if (campo !== undefined && campo !== null) {
        const campoString = campo.toString();  // Convertimos el campo a string
        return campoString.includes(valorBusqueda);  // Comparamos si el campo contiene el valor de búsqueda
      }
      return false;
    });
  }
  


  agregarDatoDinamico()
  {
    for (let i = 0; i < this.datosDinamicos.length; i++)
    {
      if (!this.datosDinamicos[i])
      {
        this.datosDinamicos[i] = true;
        break;
      }
    }
  }

  agregarDatoDinamicoFiltro()
  {
    for (let i = 0; i < this.datosDinamicosFiltros.length; i++)
    {
      if (!this.datosDinamicosFiltros[i])
      {
        this.datosDinamicosFiltros[i] = true;
        break;
      }
    }
  }


  finalizarTurno()
  {
    if (this.datosResena){

      let datosDeResena = this.datosResena;
      console.log(datosDeResena);

      this.mostrarSpinner();
      Promise.all([
        this.turnosService.setTurnoField(this.turnoSeleccionado.id, 'resena', datosDeResena),
        this.turnosService.setTurnoField(this.turnoSeleccionado.id, 'estado', 'realizado')
      ]).then(() =>
      {
        this.ocultarSpinner();
        this.datosResena = '';
        this.swal.mostrarMensajeExito('¡Turno finalizado con éxito!', 'Presione Ok para continuar');
  
      });
    }
  }

  enviarHistoriaClinica()
  {
    let historiaClinica: any = {
      altura: this.altura?.value,
      peso: this.peso?.value,
      temperatura: this.temperatura?.value,
      presion: this.presion?.value
    };

    if (this.claveDinamica1?.value && this.valorDinamico1?.value)
    {
      historiaClinica[this.claveDinamica1.value.toLowerCase()] = this.valorDinamico1.value;
    }

    if (this.claveDinamica2?.value && this.valorDinamico2?.value)
    {
      historiaClinica[this.claveDinamica2.value.toLowerCase()] = this.valorDinamico2.value;
    }
    if (this.claveDinamica3?.value && this.valorDinamico3?.value)
    {
      historiaClinica[this.claveDinamica3.value.toLowerCase()] = this.valorDinamico3.value;
    }
    console.log(historiaClinica);

    this.mostrarSpinner();
    Promise.all([
      this.turnosService.setTurnoField(this.turnoSeleccionado.id, 'historiaClinica', historiaClinica),
      this.historiaClinicaCompleta = true,
    ]).then(() =>
    {
      this.ocultarSpinner();
      this.swal.mostrarMensajeExito('¡Historia Clinica guardada con éxito!', 'Presione Ok para continuar');

    });
  }


  objectKeys(obj: any) {
    return Object.keys(obj);
  }


  mostrarSpinner()
  {
    this.claseSpinner = "spinner-activado";
  }

  ocultarSpinner()
  {
    this.claseSpinner = "spinner-desactivado";
  }


  get question1()
  {
    return this.formEncuesta.get('question1');
  }
  get question2()
  {
    return this.formEncuesta.get('question2');
  }
  get question3()
  {
    return this.formEncuesta.get('question3');
  }
  get question4()
  {
    return this.formEncuesta.get('question4');
  }
  get question5()
  {
    return this.formEncuesta.get('question5');
  }
  get question6()
  {
    return this.formEncuesta.get('question6');
  }

  get comentarioCalificacion()
  {
    return this.formCalificacion.get('comentario');
  }

  get estrellasCalificacion()
  {
    return this.formCalificacion.get('estrellas');
  }

  get peso()
  {
    return this.formHistoriaClinica.get('peso');
  }
  get temperatura()
  {
    return this.formHistoriaClinica.get('temperatura');
  }
  get altura()
  {
    return this.formHistoriaClinica.get('altura');
  }
  get presion()
  {
    return this.formHistoriaClinica.get('presion');
  }
  get claveDinamica1()
  {
    return this.formHistoriaClinica.get('claveDinamica1');
  }
  get claveDinamica2()
  {
    return this.formHistoriaClinica.get('claveDinamica2');
  }
  get claveDinamica3()
  {
    return this.formHistoriaClinica.get('claveDinamica3');
  }
  get valorDinamico1()
  {
    return this.formHistoriaClinica.get('valorDinamico1');
  }
  get valorDinamico2()
  {
    return this.formHistoriaClinica.get('valorDinamico2');
  }
  get valorDinamico3()
  {
    return this.formHistoriaClinica.get('valorDinamico3');
  }

  

}