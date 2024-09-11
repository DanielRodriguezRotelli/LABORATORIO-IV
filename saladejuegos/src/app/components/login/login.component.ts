import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { Router, RouterLink } from '@angular/router';
import { RegistrarComponent } from '../registrar/registrar.component';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HomeComponent, RouterLink, RegistrarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  mail: string = "";
  password: string = "";
  notificacion: string = "";
  usuarios: User[] = [];

  constructor(private router: Router) {}

  loguear(): void {
    if(this.mail != "" && this.password != ""){
      const auxUsuario: User = new User(this.mail, this.password);
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
          console.log(element.mail);
          if(element.mail === auxUsuario.mail){
            console.log("el mail es igual");
            console.log(element.pass);
            console.log(auxUsuario.pass);
            if(element.pass === auxUsuario.pass){
              console.log("el pass es igual");
              this.guardarUsuarioLogueado(auxUsuario);
              this.goToHome();
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

  guardarUsuarioLogueado(usuario: User):void {
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

  goToHome():void{
    this.router.navigate(['/home']);
  }

  
  setName(newName: string) {
    this.mail = newName;
  }

  setPassword(newPassword: string) {
    this.password = newPassword;
  }
}
