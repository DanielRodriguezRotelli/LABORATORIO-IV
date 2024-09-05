import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../usuario';
import { CommonModule } from '@angular/common';
import { BienvenidoComponent } from '../bienvenido/bienvenido.component';
import { ErrorComponent } from '../error/error.component';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, BienvenidoComponent, ErrorComponent, LoginComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  name: string = "";
  password: string = "";
  user: Usuario = new Usuario('Daniel', '123abc')
  
  setName(newName: string) {
    this.name = newName;
  }

  setPassword(newPassword: string) {
    this.password = newPassword;
  }

}