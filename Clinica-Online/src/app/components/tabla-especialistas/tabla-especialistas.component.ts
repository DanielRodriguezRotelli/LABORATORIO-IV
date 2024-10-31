import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Especialista } from '../../entidades/especialista';
import { Subscription } from 'rxjs';
import { EspecialistasService } from '../../services/especialistas.service';
import { NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-tabla-especialistas',
  standalone: true,
  imports: [SpinnerComponent, NgStyle, NgIf],
  templateUrl: './tabla-especialistas.component.html',
  styleUrl: './tabla-especialistas.component.css'
})
export class TablaEspecialistasComponent implements OnInit, OnDestroy{

  public especialistas: Array<Especialista>;
  public obtenerEspecialistasSub!: Subscription;
  public especialistasObtenidos: boolean;
  @Output() onEnviarId = new EventEmitter<string>();
  @Input() tipoVista: number;
  @Input() nombreEspecialidad!: string;
  @Input() maxHeight!: number;
  @Input() estado!: string;

  enviarId(id: string)
  {
    this.onEnviarId.emit(id);
  }
  constructor(public especialistasService: EspecialistasService)
  {
    this.especialistas = [];
    this.especialistasObtenidos = false;
    this.tipoVista = 0;

  }

  ngOnInit(): void
  {
    this.especialistasService.obtenerEspecialistas();
    this.obtenerEspecialistasSub = this.especialistasService.obtenerEspecialistasSubject.subscribe(status =>
    {
      if(status)
        {
          this.especialistas = this.especialistasService.coleccionEspecialistas;
          console.log("especialistas obtenidos");
          this.especialistasObtenidos = true;
        }
    });

  }

  ngOnDestroy(): void
  {
    this.obtenerEspecialistasSub.unsubscribe();
  }

  tieneEspecialidad(especialista: Especialista, nombreEspecialidad: string)
  {
    let retorno = false;
    especialista.especialidades.forEach(especialidad => {
      if(especialidad == nombreEspecialidad)
        {
          retorno = true;
        }
    });
    return retorno;
  }
  
}