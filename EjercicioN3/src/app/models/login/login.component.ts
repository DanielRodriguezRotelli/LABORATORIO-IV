import { Component } from '@angular/core';
import { Usuario } from '../usuario';
import { FormsModule } from '@angular/forms';
import { BienvenidoComponent } from '../bienvenido/bienvenido.component';
import { ErrorComponent } from '../error/error.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, BienvenidoComponent, ErrorComponent, CommonModule],
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
