import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../../models/user';
import { Router, RouterLink } from '@angular/router';
import { addDoc, collection, collectionData, Firestore, query } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { RegisterComponent } from '../register/register.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HomeComponent, RegisterComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  mail: string = "";
  password: string = "";
  notification: string = "";
  usuarios: User[] = [];
  public loginsCollection: any[] = [];
  public countLogins: number = 0;
  private sub!: Subscription;
  loggedUser: string = "";
  flagError : boolean = false;
  usuarioDeLogin: any = "";

  @Output () enviarDato = new EventEmitter<string>();

  constructor(private router: Router, 
              private firestore: Firestore,
              public auth: Auth) {}


  login() {
    if ((!this.mail || this.mail.trim() === '') && (!this.password || this.password.trim() === '')) {
      this.notification = "DEBE COMPLETAR LOS CAMPOS";
      this.flagError = true;
      return;
    } 

    if (!this.mail || this.mail.trim() === '') {
      this.notification = "DEBE INGRESAR UN E-MAIL";
      this.flagError = true;
      return;
    } 

    if (!this.password || this.password.trim() === '') {
      this.notification = "DEBE INGRESAR UNA CONTRASEÑA";
      this.flagError = true;
      return;
    } 

    
    signInWithEmailAndPassword(this.auth, this.mail, this.password).then((res) =>{
      if(res.user.email !== null) this.loggedUser = res.user.email;
      this.flagError = false;
      this.PutLogins(this.mail);
      this.usuarioDeLogin = this.auth.currentUser?.email;
      this.goToHome();

    
    }).catch((e) => {
      this.flagError = true;
      console.log(e);

      switch(e.code) {
        /*
        case "auth/missing-email":
          this.notification = "DEBE INGRERSAR UN E-MAIL";
          break;*/
        case "auth/invalid-credential":
          this.notification = "DATOS INVÁLIDOS";
          break;
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

  sendUsuarioLogueado() {
    this.enviarDato.emit(this.usuarioDeLogin);
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

  goToHome():void{
    this.router.navigate(['/home']);
  }

  clearError() {
    this.notification = ''; // Limpia el mensaje de error cuando el usuario empieza a escribir
  }

  PutLogins(mail: string) {
    let col = collection(this.firestore, 'logins'); //primer param CONECTION, segundo para COLLECTION
    let obj = {"user": mail, fecha: new Date()};
    addDoc(col, obj);
  }

  GetLogins(){
    let col = collection(this.firestore, 'logins');//primer param CONECTION, segundo para COLLECTION
    const filteredQuery = query (
      col
      //,where('user', '==', 'daniel@gmail.com')
      //, limit(2)
      //, orderBy("fecha", "desc")
    );

    const observable = collectionData(filteredQuery);

    this.sub = observable.subscribe((respuesta: any) =>{
      this. loginsCollection = respuesta;
      this.countLogins = this.loginsCollection.length;
      console.log(respuesta);
    })
  }

  fillUser1() {
    this.mail = 'danielrodriguez@gmail.com';
    this.password = 'Utn1234';
  }

  fillUser2() {
    this.mail = 'ayegarcia@gmail.com';
    this.password = '4321Utn';
  }

  fillUser3() {
    this.mail = 'titoluna@gmail.com';
    this.password = '12UTN34';
  }
}
