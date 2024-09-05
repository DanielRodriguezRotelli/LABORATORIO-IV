import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Usuario } from './models/usuario';
import { LoginComponent } from './models/login/login.component';
import { BienvenidoComponent } from './models/bienvenido/bienvenido.component';
import { ErrorComponent } from './models/error/error.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, BienvenidoComponent, ErrorComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css', 
})

export class AppComponent implements AfterViewInit{
  @ViewChild(LoginComponent) loginComponent!: LoginComponent;
  title: string = 'EJERCICIO N°2';
  user: Usuario = new Usuario('Daniel','123');
  name: string = "";
  password: string = "";
  vistaActual: string = 'login'; // Controla qué componente mostrar
  flag: boolean = false;

  ngAfterViewInit() {
    // Acceder a las propiedades name y password después de que la vista esté inicializada
    console.log('Nombre:', this.loginComponent.name);
    console.log('Contraseña:', this.loginComponent.password);
  }

  getName(): string {
    return this.loginComponent.name;
  }

  getPassword(): string {
    return this.loginComponent.password;
  }

  setNameInLogin(newName: string) {
    this.loginComponent.setName(newName);
  }

  setPasswordInLogin(newPassword: string) {
    this.loginComponent.setPassword(newPassword);
  }

  
  

  login() {
    
    if (this.user.name == this.getName() && this.user.password == this.getPassword()) {
      this.vistaActual = 'bienvenido';
      this.flag = true;
    } else {
      this.vistaActual = 'error';
      this.flag = false;
    }
  }

  volverAlLogin() {
    this.vistaActual = 'login';
    this.setPasswordInLogin("");
    this.setNameInLogin("");
  }

}