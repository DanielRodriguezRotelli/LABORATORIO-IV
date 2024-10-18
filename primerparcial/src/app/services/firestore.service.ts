import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  save(data: any, path: string) {
    const col = collection(this.firestore, path);
    addDoc(col, data);
  }

  async get(path: string): Promise<any[]> {
    const col = collection(this.firestore, path);

    try {
      const querySnapshot = await getDocs(col);
      const data = querySnapshot.docs.map(doc => doc.data());
      return data;
    } catch (error) {
      throw error;
    }
  }
}