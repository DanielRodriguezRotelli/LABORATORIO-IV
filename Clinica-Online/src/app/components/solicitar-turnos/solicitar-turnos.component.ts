import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Especialidad } from '../../entidades/especialidad';
import { Especialista } from '../../entidades/especialista';
import { Tiempo } from '../../clases/tiempo';
import { SweetAlert } from '../../clases/sweetAlert';
import { AdministradoresService } from '../../services/administradores.service';
import { PacientesService } from '../../services/pacientes.service';
import { AuthService } from '../../services/auth.service';
import { TurnosService } from '../../services/turnos.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { EspecialistasService } from '../../services/especialistas.service';
import { EspecialidadesService } from '../../services/especialidades.service';
import { Turno } from '../../entidades/turno';
import { ReactiveFormsModule } from '@angular/forms';
import { TablaEspecialistasComponent } from '../tabla-especialistas/tabla-especialistas.component';
import { TablaPacientesComponent } from '../tabla-pacientes/tabla-pacientes.component';
import { NgFor, NgIf } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MinutosAHoraPipe } from '../../pipes/minutos-ahora.pipe';

@Component({
  selector: 'app-solicitar-turnos',
  standalone: true,
  imports: [ReactiveFormsModule, TablaEspecialistasComponent, TablaPacientesComponent, NgFor, NgIf, SpinnerComponent, MinutosAHoraPipe],
  templateUrl: './solicitar-turnos.component.html',
  styleUrl: './solicitar-turnos.component.css'
})
export class SolicitarTurnosComponent implements OnInit{

  public obtenerEspecialidadesSub!: Subscription;
  public obtenerEspecialistasSub!: Subscription;
  public especialidades!: Array<Especialidad>;
  public especialistas!: Array<Especialista>;
  public especialistasFiltrados!: Array<Especialista>;
  public secuenciaCard!: string;
  public arrayTurnosEspecialista!: Array<{ fecha: string, horarios: { inicio: number, fin: number }}>;
  public tiempo: Tiempo = new Tiempo();
  public swal: SweetAlert = new SweetAlert(this.router);
  public horariosFechaSeleccionada!: Array<number>;
  public esAdmin = false;
  public horariosCargados = false;
  public opcionesSeleccionadas: {especialidad?: string, especialista?: Especialista, fecha?: string, hora?: number} = {};
  public idPaciente: string = "";

  constructor(
    public administradoresService: AdministradoresService, 
    public pacientesService: PacientesService, 
    public authService: AuthService, 
    public turnosService: TurnosService, 
    public router: Router, 
    public storageService: StorageService, 
    public especialistasService: EspecialistasService, 
    public especialidadesService: EspecialidadesService) { }

  ngOnInit(): void
  {
    if (this.authService.auth.currentUser?.email)
    {
      this.administradoresService.esAdmin(this.authService.auth.currentUser?.email).then(res =>
      {
        this.esAdmin = res;
        console.log("Admin: " + this.esAdmin);
        if (res)
        {
          this.secuenciaCard = "pacientes"
        }
        else
        {
          this.secuenciaCard = "especialidades"
        }
      });
    }

    this.especialidadesService.obtenerEspecialidades();
    this.obtenerEspecialidadesSub = this.especialidadesService.obtenerEspecialidadesSubject.subscribe(status =>
    {
      if (status)
      {
        this.especialidades = this.especialidadesService.coleccionEspecialidades;
      }
    })
    this.especialistasService.obtenerEspecialistas();

    this.obtenerEspecialistasSub = this.especialistasService.obtenerEspecialistasSubject.subscribe(status =>
    {
      if (status)
      {
        this.especialistas = this.especialistasService.coleccionEspecialistas;
      }
    });
  }



  recibirIdPaciente(idPaciente: string)
  {
    this.idPaciente = idPaciente;
  }

  cambiarSecuencia(adelante: boolean)
  {
    if (adelante)
    {
      switch (this.secuenciaCard)
      {
        case "pacientes":
          this.secuenciaCard = "especialidades";
          break;
        case "especialidades":
          this.secuenciaCard = "especialistas";
          break;
        case "especialistas":
          this.secuenciaCard = "fechas";
          break;
        case "fechas":
          this.secuenciaCard = "horarios";
          break;
      }
    }
    else
    {
      switch (this.secuenciaCard)
      {
        case "especialidades":
          if (this.esAdmin)
          {
            this.secuenciaCard = "pacientes";
          }
          break;
        case "especialistas":
          this.secuenciaCard = "especialidades";
          break;
        case "fechas":
          this.secuenciaCard = "especialistas";
          break;
        case "horarios":
          this.secuenciaCard = "fechas";
          break;
      }
    }
  }

  seleccionarEspecialidad(nombreEspecialidad: string)
  {
    this.cambiarSecuencia(true);
    this.opcionesSeleccionadas.especialidad = nombreEspecialidad;
    this.especialistasFiltrados = this.especialistas.filter((especialista) =>
    {
      return especialista.especialidades.includes(nombreEspecialidad);
    });

    console.log(this.especialistasFiltrados);
    this.especialistas.forEach(especialista =>
    {
      this.storageService.obtenerImagen(`especialistas/${especialista.mail}`).then((url) =>
      {
        if (url)
        {
          especialista.imagen = url;
        }
      })
    });

  }

  seleccionarEspecialista(especialista: Especialista)
  {
    this.opcionesSeleccionadas.especialista = especialista;
    this.cambiarSecuencia(true);
    this.cargarFechasTurnos();
    this.cargarHorariosTurnos(especialista, this.opcionesSeleccionadas.especialidad || '');
  }

  seleccionarFecha(turno: { fecha: string, horarios: { inicio: number, fin: number } })
  {
    this.opcionesSeleccionadas.fecha = turno.fecha;
    this.cambiarSecuencia(true);
    this.horariosFechaSeleccionada = [];
    this.horariosCargados = false;

    for (let i = turno.horarios.inicio; i < turno.horarios.fin; i = i + 30)
    {
      //si no hay un turno tomado para este horario...
      if (this.opcionesSeleccionadas.especialista?.id)
      {
        this.turnosService.obtenerTurnoPorIdEspecialistaFechaYHora(this.opcionesSeleccionadas.especialista?.id, this.opcionesSeleccionadas.fecha, i).then(res =>
        {
          if (!res)
          {
            this.horariosFechaSeleccionada.push(i);
          }
          if (i == turno.horarios.fin - 30)
          {
            this.horariosCargados = true;
          }
        })
      }
    }
  }

  seleccionarHorario(horario: number)
  {
    this.opcionesSeleccionadas.hora = horario;

    this.swal.mostrarMensajeConfirmar(
      "Confirmar turno",
      `Confirma solicitar turno con ${this.opcionesSeleccionadas.especialista?.nombre} ${this.opcionesSeleccionadas.especialista?.apellido} 
      el día ${this.opcionesSeleccionadas.fecha} a las ${this.tiempo.minutosAHora(this.opcionesSeleccionadas.hora)}?
      `
    ).then((res) =>
    {
      if (res.isConfirmed)
      {
        if (this.esAdmin)
        {
          let paciente = this.pacientesService.obtenerPacientePorId(this.idPaciente).then((res) =>
          {
            if (this.opcionesSeleccionadas.fecha && this.opcionesSeleccionadas.hora && this.opcionesSeleccionadas.especialista?.id && this.opcionesSeleccionadas.especialidad)
            {

              if (res?.nombre && res.apellido)
              {

                let turno: Turno = {
                  fecha: this.opcionesSeleccionadas.fecha,
                  hora: this.opcionesSeleccionadas.hora,
                  idEspecialista: this.opcionesSeleccionadas.especialista.id,
                  especialidad: this.opcionesSeleccionadas.especialidad,
                  idPaciente: this.idPaciente,
                  nombrePaciente: res?.nombre,
                  apellidoPaciente: res.apellido,
                  nombreEspecialista: this.opcionesSeleccionadas.especialista.nombre,
                  apellidoEspecialista: this.opcionesSeleccionadas.especialista.apellido
                }
                this.authService.auth.currentUser?.email
                this.turnosService.guardarTurno(turno);
                this.swal.mostrarMensajeExito("Turno solicitado", "¡El turno fue solicitado con éxito!");
                this.cambiarSecuencia(false);
                this.goToMisTurnos();
              }
            }
          })
        }
        else
        {
          if (this.authService.auth.currentUser?.email)
          {

            this.pacientesService.obtenerPacientePorEmail(this.authService.auth.currentUser?.email).then(res =>
            {
              if (this.opcionesSeleccionadas.fecha && this.opcionesSeleccionadas.hora && this.opcionesSeleccionadas.especialista?.id && this.opcionesSeleccionadas.especialidad && res?.id) 
              {
                let turno: Turno = {
                  fecha: this.opcionesSeleccionadas.fecha,
                  hora: this.opcionesSeleccionadas.hora,
                  idEspecialista: this.opcionesSeleccionadas.especialista.id,
                  especialidad: this.opcionesSeleccionadas.especialidad,
                  nombreEspecialista: this.opcionesSeleccionadas.especialista.nombre,
                  apellidoEspecialista: this.opcionesSeleccionadas.especialista.apellido,
                  nombrePaciente: res.nombre,
                  apellidoPaciente: res.apellido,
                  idPaciente: res?.id
                }

                this.authService.auth.currentUser?.email
                this.turnosService.guardarTurno(turno);
                this.swal.mostrarMensajeExito("Turno solicitado", "¡El turno fue solicitado con éxito!");
                this.cambiarSecuencia(false);
                this.goToMisTurnos();
              }
            })
          }
        }
      }
    })
  }

  cargarHorariosTurnos(especialista: Especialista, especialidadSeleccionada: string)
  {
    if (especialista.disponibilidades)
    {
      especialista.disponibilidades.forEach((disponibilidad) =>
      {
        // Verifica si la especialidad de la disponibilidad coincide con la especialidad seleccionada
        if (disponibilidad.especialidad === especialidadSeleccionada) {
          this.arrayTurnosEspecialista.forEach(turno => {
            // Aseguramos que `horarios` esté inicializado
            turno.horarios = turno.horarios || { inicio: 0, fin: 0 };

            // Verifica si el día del turno coincide con el día de la disponibilidad
            if (this.tiempo.getDia(turno.fecha) === disponibilidad.dia) {
              turno.horarios = { inicio: disponibilidad.horaInicio, fin: disponibilidad.horaFin };
            }
          });
        }
      })
    }

    for (let i = this.arrayTurnosEspecialista.length - 1; i >= 0; i--)
    {
      const turno = this.arrayTurnosEspecialista[i];
      if (turno.horarios.inicio === 0 && turno.horarios.fin === 0)
      {
        this.arrayTurnosEspecialista.splice(i, 1);
      }
    }
  }



  cargarFechasTurnos()
  {
    let proximos15Dias = this.tiempo.getProximosDias(15);
    this.arrayTurnosEspecialista = proximos15Dias.map(fecha => ({
      fecha,
      horarios: { inicio: 0, fin: 0 }
    }));
  }

  onImageError(event: Event): void
  {
    const target = event.target as HTMLImageElement;
    target.src = '../../../assets/especialidades/Default.png';
  }

  goToMisTurnos():void{
    this.router.navigate(['/turnos/mis-turnos']);
  }





}
