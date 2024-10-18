import { Injectable, signal } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword } from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { UserInterface } from '../interfaces/user.interface';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUserSig: Observable<UserInterface | null>;

  constructor(private auth: Auth, 
              private firestore: Firestore) {

    this.currentUserSig = authState(this.auth).pipe(
      map(user => {
        // Mapea las propiedades de User a UserInterface
        if (user) {
          return {
            email: user.email || '', // Asegúrate de que haya un valor por defecto
            password: '', // No puedes obtener la contraseña por razones de seguridad
            role: this.getUserRole(user.email) // Llama a un método para asignar roles
          } as UserInterface;
        }
        return null; // Devuelve null si no hay un usuario
      })
    );
  }

  getUserRole(email: string | null): string {
    // Asigna un rol basado en el correo electrónico
    if (email === 'admin@gmail.com') {
      return 'admin';
    }
    if (email === 'empleado@gmail.com') {
      return 'empleado';
    }
    return 'user'; // Rol por defecto si no coincide
  }

  async login(email: string, password: string) {
    try {
      const res = await signInWithEmailAndPassword(this.auth, email, password);
      if (res.user) {
        const now = new Date();
        const date = now.toISOString().split('T')[0]; // Extraer solo la parte de la fecha
    
        const loginLogCollection = collection(this.firestore, 'loginsUsers');
        await addDoc(loginLogCollection, {
          email,
          date: date, // Almacena solo la fecha en formato YYYY-MM-DD
        }).then(() => {
          console.log("Log entry successfully written!");
        }).catch((error) => {
          console.error("Error writing log entry: ", error);
        });
      }
      return res;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  public isLoggedIn(): Promise<boolean> {
    return new Promise((resolve: any) => {
      this.auth.onAuthStateChanged((user: any) => {
        user ? resolve(true) : resolve(false);
      });
    });
  }

  getLoggedUser(): Observable<UserInterface | null> {
    return this.currentUserSig; // Devuelve el observable para el usuario actual
  }

  logout(): Promise<void> {
    return this.auth.signOut();
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): Observable<boolean> {
    const user = this.auth.currentUser; // Obtiene el usuario actual
    return of(user !== null); // Devuelve un observable con true o false
  }

  // Método para verificar si el usuario es administrador
  getIsAdmin(): Observable<boolean> {
    return this.getLoggedUser().pipe(
      map((user: UserInterface | null) => {
        if (user && user.email === 'admin@admin.com') {
          return true;  // Usuario administrador
        }
        return false; // Usuario no administrador
      })
    );
  }
}

