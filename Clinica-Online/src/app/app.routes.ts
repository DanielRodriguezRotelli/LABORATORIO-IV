import { Routes } from '@angular/router';
import { logueadoGuard } from './guards/logueado.guard';
import { especialistaGuard } from './guards/especialista.guard';
import { pacienteGuard } from './guards/paciente.guard';

export const routes: Routes = [

    { path: '', redirectTo: '/bienvenida', pathMatch: "full" },
    {
        path: 'bienvenida',
        loadComponent: () => import('./components/bienvenida/bienvenida.component').then(m => m.BienvenidaComponent)
    },
    {
        path: 'registro',
        loadComponent: () => import('./components/registro/registro.component').then(m => m.RegistroComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'gestion-usuarios',
        loadComponent: () => import('./components/gestion-usuarios/gestion-usuarios.component').then(m => m.GestionUsuariosComponent)
    },
    {
        path: 'mi-perfil',
        loadComponent: () => import('./components/mi-perfil/mi-perfil.component').then(m => m.MiPerfilComponent),
        canActivate: [logueadoGuard]
    },
    {
        path: 'turnos/mis-turnos',
        loadComponent: () => import('./components/mis-turnos/mis-turnos.component').then(m => m.MisTurnosComponent)
    },
    {
        path: 'pacientes',
        loadComponent: () => import('./components/pacientes/pacientes.component').then(m => m.PacientesComponent),
        canActivate: [especialistaGuard]
    },
    {
        path: 'turnos/solicitar',
        loadComponent: () => import('./components/solicitar-turnos/solicitar-turnos.component').then(m => m.SolicitarTurnosComponent),
        canActivate: [pacienteGuard]
    },
    {
        path: 'pdf-historia-clinica',
        loadComponent: () => import('./components/pdf-historia-clinica/pdf-historia-clinica.component').then(m => m.PdfHistoriaClinicaComponent)
    },
    {
        path: 'pdf-pacientes',
        loadComponent: () => import('./components/pdf-pacientes/pdf-pacientes.component').then(m => m.PdfPacientesComponent)
    },
    {
        path: 'pdf-especialistas',
        loadComponent: () => import('./components/pdf-especialistas/pdf-especialistas.component').then(m => m.PdfEspecialistasComponent)
    },
    {
        path: 'pdf-administradores',
        loadComponent: () => import('./components/pdf-administradores/pdf-administradores.component').then(m => m.PdfAdministradoresComponent)    },
];
