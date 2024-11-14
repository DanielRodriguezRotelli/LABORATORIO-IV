import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Especialidad } from '../../entidades/especialidad';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetAlert } from '../../clases/sweetAlert';
import { Router } from '@angular/router';
import { EspecialidadesService } from '../../services/especialidades.service';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { AdministradoresService } from '../../services/administradores.service';
import { PacientesService } from '../../services/pacientes.service';
import { EspecialistasService } from '../../services/especialistas.service';
import { Modal } from 'bootstrap';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Disponibilidad } from '../../entidades/disponibilidad';
import { TurnosService } from '../../services/turnos.service';
import { Tiempo } from '../../clases/tiempo';
import { MinutosAHoraPipe } from '../../pipes/minutos-ahora.pipe';


@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgClass, NgIf, SpinnerComponent, MinutosAHoraPipe, CommonModule],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
  
})
export class MiPerfilComponent  implements OnInit, OnDestroy{

  usuarioActual: any;
  imagenActual: string;
  imagenActual2: string;
  @ViewChild('modalCargarDisponibilidad') modalCargarDisponibilidad!: ElementRef;
  @ViewChild('modalAgregarEspecialidad') modalAgregarEspecialidad!: ElementRef;
  @ViewChild('modalModificarDisponibilidad') modalModificarDisponibilidad!: ElementRef;
  @ViewChild('modalBorrarDisponibilidad') modalBorrarDisponibilidad!: ElementRef;
  @ViewChild('modalHistoriaClinica') modalHistoriaClinica!: ElementRef;
  obtenerEspecialidadesSub!: Subscription;
  especialidades: Array<Especialidad> = [];
  especialidadesObtenidas: boolean = false;
  formEspecialidad!: FormGroup;
  formDisponibilidad!: FormGroup;
  swal: SweetAlert = new SweetAlert(this.router);
  especialidadSeleccionada: string = "";
  //especialidad: string ="";
  dias: Array<string> = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  horarios: Array<number> = [];
  claseSpinner: string = "spinner-desactivado";
  turnos!: Array<any> | null;
  suscripcionTurnos!: Subscription;
  tieneHistoriaClinica = false;
  
  // Variables para almacenar las disponibilidades filtradas
  disponibilidadesExistentes: any[] = []; // Aquí guardarás las disponibilidades del usuario
  diasConHorariosDisponibles: [string, number[]][] = []; // Este será el array con los días y horarios disponibles


  constructor(
    public turnosService: TurnosService,
    public router: Router, 
    public fb: FormBuilder, 
    public especialidadesService: EspecialidadesService, 
    public storageService: StorageService, 
    public authService: AuthService, 
    public administradoresService: AdministradoresService, 
    public pacientesService: PacientesService, 
    public especialistasService: EspecialistasService)
  {
    this.imagenActual = "";
    this.imagenActual2 = "";
    this.cargarDatos();

    this.formEspecialidad = this.fb.group({
      nombre: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]]
    })

    this.formDisponibilidad = this.fb.group({
      especialidad: ['', Validators.required],
      dia: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required]
    })

    for (let i = 480; i <= 1140; i += 30) {
      this.horarios.push(i);
    }
    console.log('horarios construidos: ' + this.horarios); // Ejemplo de salida: ["08:00 am", "08:30 am", "09:00 am", ... "07:00 pm"]
  }

  ngOnDestroy(): void
  {
    if(this.suscripcionTurnos)
    {
      this.suscripcionTurnos.unsubscribe();
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

  objectKeys(obj: any) {
    return Object.keys(obj);
  }


  cargarDatos()
  {
    if (this.authService.auth.currentUser?.email)
    {
      console.log("Dentro de CargarDatos()");
      switch (this.authService.tipoUsuario)
      {
        case "administrador":
          this.administradoresService.obtenerAdministradorPorEmail(this.authService.auth.currentUser?.email).then(response =>
          {
            this.usuarioActual = response;
            console.log("ID Usuario Admin:", this.usuarioActual.id);
            this.storageService.obtenerImagen("administradores/" + response?.mail).then((url) =>
            {
              if (url)
              {
                this.imagenActual = url;
              }
            });
          })
          break;
        case "paciente":
          this.pacientesService.obtenerPacientePorEmail(this.authService.auth.currentUser?.email).then(response =>
          {
            this.usuarioActual = response;
            console.log("ID Usuario Paciente:", this.usuarioActual.id);
            Promise.all([
              this.storageService.obtenerImagen(`pacientes/${response?.mail}/1`),
              this.storageService.obtenerImagen(`pacientes/${response?.mail}/2`)
            ]).then(([url1, url2]) =>
            {
              if (url1)
              {
                this.imagenActual = url1;
              }
              if (url2)
              {
                this.imagenActual2 = url2;
              }
            })
            
            this.suscripcionTurnos = this.turnosService.obtenerTurnosByField('idPaciente', response?.id).subscribe({
              next: ((turnos) => {
                this.turnos = turnos;
              })
            });
            
          });

          break;
        case "especialista":
          this.especialistasService.obtenerEspecialistaPorEmail(this.authService.auth.currentUser?.email).then(response =>
          {
            this.usuarioActual = response;
            console.log("ID Usuario Especialista:", this.usuarioActual.id);
            this.storageService.obtenerImagen("especialistas/" + response?.mail).then((url) =>
            {
              if (url)
              {
                this.imagenActual = url;
              }
            });
          })
          break;
      }
    }
  }

  ngOnInit(): void {

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
  }
  

  traerDisponibilidadesExistentes(){
    this.especialistasService.getDisponibilidades(this.usuarioActual.id).subscribe(
      (disponibilidadesExistentes) => {
        this.disponibilidadesExistentes = disponibilidadesExistentes; 
        this.construirHorariosDisponibles();
      },
      (error) => {
        console.error('Error al cargar disponibilidades:', error);
      }
    );
  }

  // Función para construir el array de días y horarios disponibles
  construirHorariosDisponibles() {
    this.diasConHorariosDisponibles = [];
    console.log('Estoy dentro de construirHorariosDisponibles');

    // Itera sobre cada día de la semana
    this.dias.forEach(dia => {
      // Busca si el día tiene alguna disponibilidad asignada
      const disponibilidad = this.disponibilidadesExistentes.find(item => item.dia === dia);

      const diasYHorariosOcupados: any = []; // Aquí se guardarán los días y horarios ocupados

      // Si existe disponibilidad para el día, crea un array de objetos con día y horarios ocupados
      if (disponibilidad) {
        for (let i = disponibilidad.horaInicio; i < disponibilidad.horaFin; i += 30) {
          diasYHorariosOcupados.push({ dia: disponibilidad.dia, hora: i });
        }
      }
      console.log('Día:', dia);
      console.log('Horarios ocupados:', diasYHorariosOcupados);

      // Si no hay disponibilidad para el día, consideramos que todos los horarios están disponibles
      let horariosDisponibles = this.horarios;
      
      if (disponibilidad) {
        // Compara los horarios completos con los ocupados
        horariosDisponibles = this.horarios.filter(horario => 
          !diasYHorariosOcupados.some((item:any) => item.hora === horario)
        );
      }

      // Si hay al menos un horario disponible y que no sea el de las 19:00 (1140), agregar el día al array
      if (horariosDisponibles.length === 1 && horariosDisponibles.includes(1140)) {
        console.log('No se incluye en arrary: ', dia, horariosDisponibles);
      }else{
        this.diasConHorariosDisponibles.push([dia, horariosDisponibles]);
      }
    });

    console.log('Días con horarios disponibles:', this.diasConHorariosDisponibles);
  }



  mostrarModalCargarDisponibilidad()
  {
    const modal: any = new Modal(this.modalCargarDisponibilidad.nativeElement);
    modal.show();

    this.traerDisponibilidadesExistentes();
    console.log('Disponibilidad para usar1: ', this.diasConHorariosDisponibles);
  }

  mostrarModalAgregarEspecialidad()
  {
    const modal: any = new Modal(this.modalAgregarEspecialidad.nativeElement);
    modal.show();
  }

  mostrarModalModificarDisponibilidad()
  {
    const modal: any = new Modal(this.modalModificarDisponibilidad.nativeElement);
    modal.show();
  }

  mostrarModalBorrarDisponibilidad()
  {
    const modal: any = new Modal(this.modalBorrarDisponibilidad.nativeElement);
    modal.show();
  }

  mostrarModalHistoriaClinica()
  {
    this.tieneHistoriaClinica = false;
    if(this.turnos)
    {
      for(let i=0 ; i<this.turnos.length ; i++)
      {
        if(this.turnos[i].historiaClinica)
          {
            this.tieneHistoriaClinica = true;
            break;
          }
        }
    }
    else
    {
      this.tieneHistoriaClinica = false;
    }
    const modal: any = new Modal(this.modalHistoriaClinica.nativeElement);
    modal.show();
  }

  
  descargarPDF()
  {
    window.open('pdf-historia-clinica');
  }


  descargarAtenciones()
  {
    window.open('pdf-atenciones');
  }
  

  
  //enviarFormAñadirEspecialidadAEspecialista(){}
  
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

  close(){
    this.formEspecialidad.reset();
  }
  
  enviarFormCrearDisponibilidad()
  {
    if (this.formDisponibilidad.valid)
    {
      let disponibilidad: Disponibilidad = {
        especialidad: this.especialidadDeDisponibilidad?.value,
        dia: this.dia?.value,
        horaInicio: parseInt(this.horaInicio?.value),
        horaFin: parseInt(this.horaFin?.value)
      }
      this.mostrarSpinner();
      this.especialistasService.crearDisponibilidad(this.usuarioActual.id, disponibilidad).then(() =>
      {
        this.swal.mostrarMensajeExito("Exito", "Disponibilidad cargada con éxito");
        this.cargarDatos();
        this.formDisponibilidad.reset();
        this.ocultarSpinner();
      }).catch(() =>
      {
        this.swal.mostrarMensajeError("Error", "Ocurrio un error inesperado al cargar la disponibilidad");
        this.formDisponibilidad.reset();
        this.ocultarSpinner();
      });

    } else
    {
      this.formEspecialidad.markAllAsTouched();
    }
  }

  traerDisponibilidad(disponibilidad: any): void 
  {
    // Guarda el ID de la disponibilidad y carga los valores en el formulario
    //this.disponibilidadId = disponibilidad.id;  // Asume que `disponibilidad.id` contiene el ID del documento
    //console.log('Id disponibilidad :' + this.disponibilidadId);
    this.formDisponibilidad.patchValue({
      especialidad: disponibilidad.especialidad,
      dia: disponibilidad.dia,
      horaInicio: disponibilidad.horaInicio,
      horaFin: disponibilidad.horaFin
    });
  }


  enviarFormModificarDisponibilidad() 
  {
    if (this.formDisponibilidad.valid) {
      // Crear el objeto Disponibilidad con los datos del formulario
      const disponibilidad: Disponibilidad = {
        especialidad: this.formDisponibilidad.get('especialidad')?.value,
        dia: this.formDisponibilidad.get('dia')?.value,
        horaInicio: parseInt(this.formDisponibilidad.get('horaInicio')?.value),
        horaFin: parseInt(this.formDisponibilidad.get('horaFin')?.value)
      };
  
      this.mostrarSpinner();
  
      // Intentar actualizar la disponibilidad existente
      this.especialistasService.actualizarDisponibilidad(this.usuarioActual.id, disponibilidad)
        .then(() => {
          this.swal.mostrarMensajeExito("Éxito", "Disponibilidad modificada con éxito");
          this.cargarDatos(); // Recargar datos actualizados
          this.formDisponibilidad.reset();
        })
        .catch(error => {
          // Si no se encontró la disponibilidad
          if (error.message === 'No se encontró una disponibilidad para este día y horario') {
            this.swal.mostrarMensajeError("Error", "Disponibilidad inexistente para este día y horario");
            this.formDisponibilidad.reset();
          } else {
            this.swal.mostrarMensajeError("Error", "Ocurrió un error inesperado al modificar la disponibilidad");
            this.formDisponibilidad.reset();
          }
        })
        .finally(() => {
          this.ocultarSpinner();
        });
  
    } else {
      this.formDisponibilidad.markAllAsTouched();
    }
  }

  borrarDisponibilidadSeleccionada(disponibilidad: any): void 
  {
    let disponibilidadABorrar: Disponibilidad = {
      especialidad: disponibilidad.especialidad,
      dia: disponibilidad.dia,
      horaInicio: disponibilidad.horaInicio,
      horaFin: disponibilidad.horaFin
    };
     
    this.swal.mostrarMensajeConfirmar(
      "Borrar Disponibilidad",
      `Confirma borrar disponibilidad de ${disponibilidadABorrar.especialidad} el día ${disponibilidadABorrar.dia} 
      desde ${disponibilidadABorrar.horaInicio} hasta las ${disponibilidadABorrar.horaFin}`
    ).then((res) =>
    {
      if (res.isConfirmed)
      {
         // Si el usuario confirma, eliminamos la disponibilidad
         this.eliminarDisponibilidad(disponibilidad);
        } else {
          console.log('Eliminación cancelada');
        }
      });
  }

  eliminarDisponibilidad(disponibilidad: Disponibilidad): void {
    this.especialistasService.eliminarDisponibilidad(this.usuarioActual.id, disponibilidad)
      .then(() => {
        this.swal.mostrarMensajeExito('Éxito', 'Disponibilidad eliminada con éxito');
        this.cargarDatos(); // Recargar los datos (disponibilidades actualizadas)
        //this.modalBorrarDisponibilidad.hide(); // Cerrar el modal
      })
      .catch(() => {
        this.swal.mostrarMensajeError('Error', 'Ocurrió un error al eliminar la disponibilidad');
      });
  }
  
  

  seleccionarEspecialidad(especialidad: string)
  {
    this.especialidadSeleccionada = especialidad;
  }

  agregarEspecialidad()
  {
    let especialidadRepetida = false;
    this.usuarioActual.especialidades.forEach((especialidad: string) =>
    {
      if (especialidad == this.especialidadSeleccionada)
      {
        this.swal.mostrarMensajeError("Error", "Ya posee la especialidad " + this.especialidadSeleccionada);
        especialidadRepetida = true;
      }
    });

    if (!especialidadRepetida)
    {
      this.mostrarSpinner();
      this.especialistasService.agregarEspecialidad(this.usuarioActual.id, this.especialidadSeleccionada).then(() =>
      {
        this.cargarDatos();
        this.ocultarSpinner();
        this.swal.mostrarMensajeExito("Exito", "Especialidad agregada con éxito");

      });
    }
    this.especialidadSeleccionada = "";
  }



  get nombreEspecialidad()
  {
    return this.formEspecialidad.get('nombre');
  }

  get especialidadDeDisponibilidad()
  {
    return this.formDisponibilidad.get('especialidad');
  }
  get dia()
  {
    return this.formDisponibilidad.get('dia');
  }
  get horaInicio()
  {
    return this.formDisponibilidad.get('horaInicio');
  }
  get horaInicioValue(): number
  {
    const control = this.formDisponibilidad.get('horaInicio');
    return control ? control.value : null;
  }
  get diaValue(): string
  {
    const control = this.formDisponibilidad.get('dia');
    return control ? control.value : null;
  }
  get horaFin()
  {
    return this.formDisponibilidad.get('horaFin');
  }
}