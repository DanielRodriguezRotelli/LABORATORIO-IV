import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Paciente } from '../../entidades/paciente';
import { Tiempo } from '../../clases/tiempo';
import { PacientesService } from '../../services/pacientes.service';
import { TurnosService } from '../../services/turnos.service';
import { AuthService } from '../../services/auth.service';
import { Modal } from 'bootstrap';
import { CommonModule, NgClass } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MinutosAHoraPipe } from '../../pipes/minutos-ahora.pipe';
import { Turno } from '../../entidades/turno';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { HighlightOnHoverDirective } from '../../directives/highlight-on-hover.directive';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [NgClass, SpinnerComponent, MinutosAHoraPipe, CommonModule, CapitalizePipe, HighlightOnHoverDirective],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit, OnDestroy {

  public claseSpinner = "spinner-desactivado";
  public suscripcionTurnos!: Subscription;
  public suscripcionPacientes!: Subscription;
  public turnos!: any;
  public pacientes!: Array<Paciente>;
  public tiempo: Tiempo = new Tiempo();
  public pacienteSeleccionado!: Paciente;
  public turnoSeleccionado!: Turno;
  @ViewChild('modalResena') modalResena!: ElementRef;
  //@ViewChild('modalDetallePaciente') modalDetallePaciente!: ElementRef;
  @ViewChild('modalDetallesTurnos') modalDetallesTurnos!: ElementRef;

  constructor(
    public pacientesService: PacientesService, 
    public turnosService: TurnosService, 
    public authService: AuthService) { }


  ngOnInit(): void
  {
    let ocultarSpinner = [false, false];
    this.mostrarSpinner();
    this.authService.esperarCargarUsuario().then(() =>
    {
      this.suscripcionTurnos = this.turnosService.obtenerTurnosByField('idEspecialista', this.authService.usuarioLogeado.id).subscribe({
        next: (res) =>
        {
          this.turnos = res;
          console.log('turnos: ', this.turnos);
          ocultarSpinner[0] = true;
          if (!ocultarSpinner.includes(false))
          {
            this.ocultarSpinner();
          }
        }
      })

      this.suscripcionPacientes = this.pacientesService.getPacientes().subscribe({
        next: (res) =>
        {
          this.pacientes = res;
          console.log('Pacientes: ',this.pacientes);
          ocultarSpinner[1] = true;
          if (!ocultarSpinner.includes(false))
          {
            this.ocultarSpinner();
          }
        }
      })
    });
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

  filtrarPacientes()
  {
    let pacientesFiltrados: any[] = [];
    let idsFiltrados: Set<string | undefined> = new Set();

    for (let i = 0; i < this.turnos.length; i++)
    {
      for (let j = 0; j < this.pacientes.length; j++)
      {
        //turnos que correspondan al paciente y esten realizados
        if (this.turnos[i].idPaciente == this.pacientes[j].id && this.turnos[i].estado == "realizado")
        {
          if (idsFiltrados.has(this.pacientes[j].id))
          {
            break;
          } else
          {
            pacientesFiltrados.push(this.pacientes[j]);
            idsFiltrados.add(this.pacientes[j].id);
          }
        }
      }
    }
    return pacientesFiltrados;
  }

  filtrarTurnosRealizados(paciente: Paciente)
  {
    let turnosFiltrados: any ="";
     //solo los turnos que correspondan al paciente y ya esten realizados
    turnosFiltrados = this.turnos.filter((turno: any) => turno.idPaciente === paciente.id && turno.estado == 'realizado');
    return turnosFiltrados;
  }

  filtrarUltimosTresTurnos(paciente: Paciente)
  {
    //solo los turnos que correspondan al paciente y ya esten realizados
    let turnosFiltrados = this.turnos.filter((turno: any) => turno.idPaciente === paciente.id && turno.estado == 'realizado');
    //ordenar turnos por fecha descendente
    let turnosOrdenados = turnosFiltrados.sort((a: any, b: any) => this.tiempo.fechaADate(b.fecha).getTime() - this.tiempo.fechaADate(a.fecha).getTime());
    //primeros 3 turnos
    return turnosOrdenados.slice(0, 3);
  }

  mostrarModalResena(turno: Turno)
  {
    this.turnoSeleccionado = turno;
    console.log('Reseña del turno:', turno.resena);
    const modal: any = new Modal(this.modalResena.nativeElement);
    modal.show();
  }

  mostrarModalDetallesTurnos(paciente: Paciente)
  {
    this.pacienteSeleccionado = paciente;
    const modal: any = new Modal(this.modalDetallesTurnos.nativeElement);
    modal.show();
  }

  verResena(turno: any) {
    // Aquí podrías redirigir a una página o mostrar un modal para ver la reseña del turno
    console.log('Reseña del turno:', turno);
    // Navegar a otra ruta (ejemplo)
    // this.router.navigate(['/resena', turno.id]);
  }

  objectKeys(obj: any)
  {
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
}