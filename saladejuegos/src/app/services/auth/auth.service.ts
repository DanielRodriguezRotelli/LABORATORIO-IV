import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth, User, authState, signInWithEmailAndPassword } from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private auth: Auth,
              private firestore : Firestore) {   
            
    this.user$ = authState(this.auth);
  }

  async login(email: string, password: string) {
    try {
      const res = await signInWithEmailAndPassword(this.auth, email, password);
      if (res.user) {
        const now = new Date();
        const date = now.toISOString().split('T')[0]; // Extract only the date part
    
        const loginLogCollection = collection(this.firestore, 'loginLog');
        await addDoc(loginLogCollection, {
          email,
          date: date, // Store only the date in YYYY-MM-DD format
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

  public isLoggedIn(): Promise<boolean>
  {
    return new Promise((resolve: any) =>{
      this.auth.onAuthStateChanged((user) =>{
        resolve(!!user);
      });
    });
  }

  getLoggedUser(): User | null {
    return this.auth.currentUser;
  }

  logout(): Promise<void> {
    return this.auth.signOut();
  }



}
