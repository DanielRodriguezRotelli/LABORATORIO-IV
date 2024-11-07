import { Injectable } from '@angular/core';
import { FirebaseError, initializeApp } from '@angular/fire/app';
import { Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { SweetAlert } from '../clases/sweetAlert';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { AdministradoresService } from './administradores.service';
import { PacientesService } from './pacientes.service';
import { Router } from '@angular/router';
import { EspecialistasService } from './especialistas.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedUser: string = "";
  public errorRegistro: boolean = false;
  public mensajeErrorRegister: string = "";
  public errorLogin: boolean = false;
  public mensajeErrorLogin: string = "";
  public isLoggedIn: boolean = false;
  public firebaseInicializado: boolean = false;
  public usuarioLogeado!: any;
  public tipoUsuario: string = "";
  swal: SweetAlert = new SweetAlert(this.router);
  private userLoadedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userLoaded$ = this.userLoadedSubject.asObservable(); // Observable para suscripción externa
  public secondaryApp: any;

  constructor(
    public auth: Auth, 
    public administradoresService: AdministradoresService, 
    public pacientesService: PacientesService, 
    public especialistasService: EspecialistasService, 
    public router: Router)
  {
    this.auth.authStateReady().then(() =>
    {
      // Firebase está inicializado y listo para usar
      this.firebaseInicializado = true;
    });

    const secondaryAppConfig = {
      apiKey: 'AIzaSyDKKWiR7ncgFSsklLqFUBxLyAyw8UfKxX0',
      authDomain: 'clinicaonline-a296c.firebaseapp.com',
      //atabaseURL: 'https://databaseName.firebaseio.com',
    };
    this.secondaryApp = initializeApp(secondaryAppConfig, 'Secondary');



    //verifico el tipo de usuario
    onAuthStateChanged(this.auth, (user) =>
    {
      if (user && user.emailVerified)
      {
        console.log("Usuario autenticado encontrado:", user);
        if (user.email)
        {
          console.log('usuario Email: ' + user.email);
          this.loadUserData(user.email);
        }
        else
        {
          this.usuarioLogeado = null;
          this.userLoadedSubject.next(true);
        }
      }
    });
  }

  private loadUserData(email: string) {
    Promise.all([
      this.administradoresService.getAdminByMail(email),
      this.pacientesService.getPacienteByMail(email),
      this.especialistasService.getEspecialistaByMail(email)
    ]).then(([adminRes, pacienteRes, especialistaRes]) => {
      if (adminRes.docs.length > 0) {
        this.usuarioLogeado = adminRes.docs[0].data();
        this.usuarioLogeado.id = adminRes.docs[0].id;
        console.log('usuario Admin: ' + this.usuarioLogeado);
        this.tipoUsuario = "administrador";
      } else if (pacienteRes.docs.length > 0) {
        this.usuarioLogeado = pacienteRes.docs[0].data();
        this.usuarioLogeado.id = pacienteRes.docs[0].id;
        console.log('usuario Paciente:' + this.usuarioLogeado);
        this.tipoUsuario = "paciente";
      } else if (especialistaRes.docs.length > 0) {
        this.usuarioLogeado = especialistaRes.docs[0].data();
        this.usuarioLogeado.id = especialistaRes.docs[0].id;
        console.log('usuario Especialista : ' + this.usuarioLogeado);
        this.tipoUsuario = "especialista";
      }
      this.userLoadedSubject.next(true);
    });
  }


  /*
  esperarCargarUsuario(): Promise<void> {
    return new Promise<void>((resolve) => {

      // Verificar el estado inicial
    console.log("Estado inicial de userLoadedSubject:", this.userLoadedSubject.getValue());

      if (this.userLoadedSubject.getValue()) {
        resolve();
      } else {
        const subscription = this.userLoadedSubject.subscribe((loaded) => {
          console.log("userLoadedSubject emitió:", loaded); // Imprimir cada cambio en loaded
          if (loaded) {
            resolve();
            subscription.unsubscribe();
          }
        });
      }
    });
  }*/

    // Método para esperar la carga del usuario
  esperarCargarUsuario(): Promise<void> {
    console.log("Esperando carga de usuario en esperarCargarUsuario...");

    return new Promise((resolve) => {
      this.userLoaded$.subscribe((loaded) => {
        console.log("userLoadedSubject emitió:", loaded);
        if (loaded) {
          resolve();
        }
      });
    });
  }

  /*
  // Simulación del inicio de sesión (ajusta según la lógica real)
  iniciarSesion() {
    console.log("Simulando inicio de sesión...");
    setTimeout(() => {
      console.log('Usuario autenticado. Emitiendo true en userLoadedSubject');
      this.userLoadedSubject.next(true); // Marca como cargado
    }, 1000); // Simulación de un retraso en la autenticación
  }*/

  authStateReady(): Promise<void>
  {
    return this.auth.authStateReady();
  }

  registerSinLogin(email: string, password: string)
  {
    const auth = getAuth(this.secondaryApp);

    if (auth.currentUser)
    {
      return signOut(auth)
        .catch(() =>
        {
          // Ignorar el error de signOut y proceder con la creación del usuario
        })
        .then(() =>
        {
          return createUserWithEmailAndPassword(auth, email, password);
        })
        .catch(error =>
        {
          // Manejar el error de createUserWithEmailAndPassword si ocurre
          throw error;
        });
    }
    else
    {
      return createUserWithEmailAndPassword(auth, email, password);

    }


  }

  register(email: string, password: string)
  {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }


  logIn(userMail: string, userPassword: string) {
    return this.especialistasService.obtenerEspecialistaPorEmail(userMail)
      .then(res => {
        if (res) {
          console.log(res);
          if (res.estado === "aprobado") {
            return signInWithEmailAndPassword(this.auth, userMail, userPassword);
          } else {
            throw new FirebaseError("especialista-no-aprobado", "El especialista no ha sido aprobado por un administrador.");
          }
        } else {
          return signInWithEmailAndPassword(this.auth, userMail, userPassword);
        }
      })
      .then((userCredential) => {
        this.firebaseInicializado = true;
        this.usuarioLogeado = userCredential.user;
  
        const email = userCredential.user.email;
        if (email) {
          // Usamos Promise.all para esperar todas las promesas y asignar tipoUsuario
          this.loadUserData(email);
        }
        return userCredential;
      })
      .catch((error: FirebaseError) => {
        throw error;
      });
  }
  
  

  LogOut()
  {
    signOut(this.auth).then(() =>
    {
      this.tipoUsuario = "";
      this.usuarioLogeado = null;
    });
  }

  traducirErrorCode(error: string): string
  {
    let errorTraducido;
    switch (error)
    {
      case "auth/email-already-in-use":
        errorTraducido = "el email ya está en uso";
        break;
      case "auth/weak-password":
        errorTraducido = "la contraseña debe tener más de 6 caracteres";
        break;
      case "auth/invalid-email":
        errorTraducido = "el email es inválido";
        break;
      case "auth/invalid-credential":
        errorTraducido = "el usuario no existe o la contraseña es incorrecta";
        break;
      case "auth/missing-password":
        errorTraducido = "la contraseña no puede estar vacía";
        break;
      case "auth/missing-email":
        errorTraducido = "el email no puede estar vacío";
        break;
      case "especialista-no-aprobado":
        errorTraducido = "El especialista no ha sido aprobado por un administrador";
        break;
      default:
        errorTraducido = "ocurrió un error inesperado";
        break;
    }
    return errorTraducido;
  }
}