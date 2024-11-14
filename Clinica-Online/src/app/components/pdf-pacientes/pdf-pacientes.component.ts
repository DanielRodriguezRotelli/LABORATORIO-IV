import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Paciente } from '../../entidades/paciente';
import { PacientesService } from '../../services/pacientes.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pdf-pacientes',
  standalone: true,
  imports: [],
  templateUrl: './pdf-pacientes.component.html',
  styleUrl: './pdf-pacientes.component.css'
})
export class PdfPacientesComponent implements OnInit, OnDestroy {
  public suscripcion!: Subscription;
  public claseSpinner = 'spinner-desactivado';
  public pacientes!: Paciente[];

  constructor(
    public pacientesService: PacientesService, 
    public authService: AuthService, 
    public router: Router){}

  ngOnInit(): void
  {
    this.mostrarSpinner();
    this.authService.esperarCargarUsuario().then(() => {
      if(this.authService.tipoUsuario == 'administrador')
      {

        this.suscripcion = this.pacientesService.getPacientes().subscribe({
          next: (res) => {
            this.pacientes = res;
            this.ocultarSpinner();
            console.log('Pacientes: ', this.pacientes);
          }
        })
      }
      else{
        console.log("no es administrador");
        this.ocultarSpinner();
        this.router.navigateByUrl('bienvenida');
      }
      })
  }

  ngOnDestroy(): void
  {
    if(this.suscripcion)
    {
      this.suscripcion.unsubscribe();
    }
  }
  mostrarSpinner()
  {
    this.claseSpinner = 'spinner-activado';
  }

  ocultarSpinner()
  {
    this.claseSpinner = 'spinner-desactivado';
  }


  descargarPdf()
  {/*
    let data = document.getElementById('table-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'pacientes.xlsx');*/
  }
}