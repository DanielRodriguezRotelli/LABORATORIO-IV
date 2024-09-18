import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, LoginComponent, HomeComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  usuarios!: User [];
  mail: string = "";
  pass: string = "";
  notification: string = "";
  loggedUser: string = "";
  flagError : boolean = false;


  constructor(private router: Router,
              public auth: Auth,
              private firestore: Firestore) {}


  register()  {

    if ((!this.mail || this.mail.trim() === '') && (!this.pass || this.pass.trim() === '')) {
      this.notification = "DEBE COMPLETAR LOS CAMPOS";
      this.flagError = true;
      return;
    } 

    if (!this.mail || this.mail.trim() === '') {
      this.notification = "DEBE INGRESAR UN E-MAIL";
      this.flagError = true;
      return;
    } 

    if (!this.pass || this.pass.trim() === '') {
      this.notification = "DEBE INGRESAR UNA CONTRASEÑA";
      this.flagError = true;
      return;
    } 

    createUserWithEmailAndPassword(this.auth, this.mail, this.pass).then((res) =>{
      if(res.user.email !== null) this.loggedUser = res.user.email;
      this.flagError = false;
      this.PutLogins(this.mail);
      this.goToHome();

    
    }).catch((e) => {
      this.flagError = true;
      console.log(e);

      switch(e.code) {
        /*
        case "auth/missing-email":
          this.notification = "DEBE INGRERSAR UN E-MAIL";
          break;*/
        case "auth/invalid-email":
          this.notification = "E-MAIL INVÁLIDO";
          break;
        case "auth/missing-password":
          this.notification = "DEBE INGRESAR CONTRASEÑA";
          break;
        case "auth/email-already-in-use":
          this.notification = "E-MAIL YA EXISTE";
          break;
        case "auth/operation-not-allowed":
          this.notification = "REGISTRO DESHABILITADO";
          break;
        case "auth/weak-password":
          this.notification = "CONTRASEÑA MUY DÉBIL";
          break;
        case "auth/network-request-failed":
          this.notification = "ERROR DE CONEXIÓN";
          break;
        case "auth/too-many-requests":
          this.notification = "DEMASIADOS INTENTOS, INTÉNTALO MÁS TARDE";
          break;
        case "auth/internal-error":
          this.notification = "ERROR INTERNO";
          break;
        
        default:
          this.notification = e.code;
          break;
      }
    })
  }


  goToLogin():void{
    this.router.navigate(['/login']);
  }

  goToHome():void{
    this.router.navigate(['/home']);
  }

  showNotification(mensaje: string): void {
    this.notification = mensaje;
    const notificationElement = document.querySelector('.notification') as HTMLElement;
    notificationElement.style.visibility = 'visible';
  }

  hideNotification(): void {
    this.notification = ''; 
    const notificationElement = document.querySelector('.notification') as HTMLElement;
    notificationElement.style.visibility = 'hidden';
  }

  clearError() {
    this.notification = ''; // Limpia el mensaje de error cuando el usuario empieza a escribir
  }

  PutLogins(mail: string) {
    let col = collection (this.firestore, 'logins'); //primer param CONECTION, segundo para COLLECTION
    let obj = {"user": mail, fecha: new Date()};
    addDoc (col, obj);
  }

}
