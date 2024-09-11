import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BienvenidoComponent } from '../bienvenido/bienvenido.component';
import { ErrorComponent } from '../error/error.component';
import { Usuario } from '../usuario';
import { Router, RouterLink } from '@angular/router';
import { RegistrarComponent } from '../registrar/registrar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, BienvenidoComponent, ErrorComponent, RouterLink, RegistrarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  mail: string = "";
  password: string = "";
  notificacion: string = "";
  usuarios: Usuario[] = [];

  constructor(private router: Router) {}

  loguear(): void {
    if(this.mail != "" && this.password != ""){
      const auxUsuario: Usuario = new Usuario(this.mail, this.password);
      const strUsuarios = localStorage.getItem("claseUsuarios");
      // Intenta parsear el string. Si no es un array, se asigna un array vacío.
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
        this.mostrarNotificacion("Usuario no registrado. Registrese.");
      }else{
        for (let element of this.usuarios){
          if(element.mail === auxUsuario.mail){
            if(element.password === auxUsuario.password){
              this.guardarUsuarioLogueado(auxUsuario);
              this.goToBienvenido();
            }else{
              this.mostrarNotificacion("Contraseña incorrecta.");
            }
            return;
          }
        };   
        this.mostrarNotificacion("Usuario no registrado. Registrese."); 
      }
    }else{
      this.mostrarNotificacion("Complete ambos campos");
    }
  }

  guardarUsuarioLogueado(usuario: Usuario):void {
    const usuarioString = JSON.stringify(usuario);
    localStorage.setItem("claseUsuarioLogueados", usuarioString);
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

  goToBienvenido():void{
    this.router.navigate(['/bienvenido']);
  }

  
  setName(newName: string) {
    this.mail = newName;
  }

  setPassword(newPassword: string) {
    this.password = newPassword;
  }
}
