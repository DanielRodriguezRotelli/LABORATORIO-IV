import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TurnosService } from '../../services/turnos.service';
import { Paciente } from '../../entidades/paciente';
import { Subscription } from 'rxjs';
import { Tiempo } from '../../clases/tiempo';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NgClass } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { AdministradoresService } from '../../services/administradores.service';
import { PacientesService } from '../../services/pacientes.service';
import { EspecialistasService } from '../../services/especialistas.service';

@Component({
  selector: 'app-pdf-historia-clinica',
  standalone: true,
  imports: [NgClass, SpinnerComponent],
  templateUrl: './pdf-historia-clinica.component.html',
  styleUrl: './pdf-historia-clinica.component.css'
})
export class PdfHistoriaClinicaComponent implements OnInit, OnDestroy{

  public claseSpinner = 'spinner-desactivado';
  public paciente!: Paciente;
  public suscripcionTurnos!: Subscription;
  public turnos!: any;
  public fechaActual!: string;
  public tituloInforme!: string;
  public tiempo: Tiempo = new Tiempo();
  public usuarioActual: any;


  constructor(
    public authService: AuthService, 
    public turnosService: TurnosService,
    public administradoresService: AdministradoresService, 
    public pacientesService: PacientesService, 
    public especialistasService: EspecialistasService) {
      this.cargarDatos();
      console.log('usuario: ' + this.authService.auth.currentUser?.email); // Ejemplo de salida: ["08:00 am", "08:30 am", "09:00 am", ... "07:00 pm"]
     }
  
  ngOnInit(): void
  {
    this.mostrarSpinner();
    console.log('usuariosActual: ', this.usuarioActual);
    console.log('Entró en el esperarCargarUsuario()');
    this.fechaActual = this.tiempo.getFechaActual();
    this.paciente = this.usuarioActual;
    console.log('paciente: ', this.paciente);
    this.tituloInforme = `Historia clínica de ${this.authService.usuarioLogeado.nombre} ${this.authService.usuarioLogeado.apellido} DNI ${this.authService.usuarioLogeado.dni}`
    this.suscripcionTurnos = this.turnosService.obtenerTurnosPorFields(['idPaciente'], [this.authService.usuarioLogeado.id]).subscribe({
      next: (res) =>
      {
        this.turnos = res;
        this.suscripcionTurnos.unsubscribe();
      }
    })

    this.ocultarSpinner();
    
  }

  ngOnDestroy(): void
  {
    if (this.suscripcionTurnos)
    {
      this.suscripcionTurnos.unsubscribe();
    }
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
          })
          break;
        case "paciente":
          this.pacientesService.obtenerPacientePorEmail(this.authService.auth.currentUser?.email).then(response =>
          {
            this.usuarioActual = response;
            console.log("ID Usuario Paciente:", this.usuarioActual.id);

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
          })
          break;
      }
    }
  }

  downloadPDF(): void
  {
    this.mostrarSpinner();
    const DATA: any = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };

    html2canvas(DATA, options).then((canvas) =>
    {
      const img = canvas.toDataURL('image/PNG');
      console.log("ok");
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) =>
    {
      docResult.save('historiaclinica.pdf');
      this.ocultarSpinner();
    })

  }

  objectKeys(obj: any)
  {
    return Object.keys(obj);
  }

  mostrarSpinner()
  {
    this.claseSpinner = 'spinner-activado';
  }

  ocultarSpinner()
  {
    this.claseSpinner = 'spinner-desactivado';
  }
}
