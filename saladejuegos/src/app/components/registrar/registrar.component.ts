import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [FormsModule, LoginComponent],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css'
})

export class RegistrarComponent {
  usuarios!: User [];
  mail: string = "";
  pass: string = "";
  notificacion: string = "";

  constructor(private router: Router) {}

  registrar(): void {
    
    if(this.mail != "" && this.pass != ""){
      const auxUsuario: User = new User(this.mail, this.pass);
      const strUsuarios = localStorage.getItem("claseUsuarios");
      
      try {
        this.usuarios = strUsuarios ? JSON.parse(strUsuarios) : [];
        
        // Verificar que this.usuarios realmente sea un array
        if (!Array.isArray(this.usuarios)) {
          this.usuarios = [];
        }
      } catch (e) {
        console.error("Error parsing JSON from localStorage:", e);
        this.usuarios = [];
      }
      
      console.log(this.usuarios);
      
      if(this.usuarios.length === 0) {
        this.usuarios = [auxUsuario];
        this.guardarUsuarios();
        this.guardarUsuarioLogueado(auxUsuario);
        this.goToLogin();
      }else{
        for (let element of this.usuarios) {
          if (element.mail === auxUsuario.mail){
            this.mostrarNotificacion("Este mail ya está registrado. Pruebe iniciando sesión.");
            return
          }
        };        
        this.usuarios.push(auxUsuario);
        this.guardarUsuarios();
        this.guardarUsuarioLogueado(auxUsuario);
        this.goToLogin();
      }
    }else{
      this.mostrarNotificacion("Complete ambos campos");
    }
  }

  guardarUsuarios():void {
    const usuariosString = JSON.stringify(this.usuarios);
    localStorage.setItem("claseUsuarios", usuariosString);
  }

  guardarUsuarioLogueado(usuario: User):void {
    const usuarioString = JSON.stringify(usuario);
    localStorage.setItem("claseUsuarioLogueado", usuarioString);
  }

  goToLogin():void{
    this.router.navigate(['/login']);
  }

  mostrarNotificacion(mensaje: string): void {
    this.notificacion = mensaje;
    const notificationElement = document.querySelector('.notification') as HTMLElement;
    notificationElement.style.visibility = 'visible';
  }

  esconderNotificacion(): void {
    this.notificacion = ''; 
    const notificationElement = document.querySelector('.notification') as HTMLElement;
    notificationElement.style.visibility = 'hidden';
  }

}
