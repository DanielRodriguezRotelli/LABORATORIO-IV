import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc } from '@firebase/firestore';
import { Icecream } from '../models/iceCream';

@Injectable({
  providedIn: 'root'
})
export class IceCreamService {

  private helados: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.helados = collection(this.firestore, 'helados');
  }
  async getIceCreamAsync() {
    const querySnapshot = await getDocs(query(this.helados));
    const result: Icecream[] = [];

    querySnapshot.forEach(document => {
      const data = document.data();

      const repartidor = new Icecream(
        document.id,
        data['tipo'],
        data['precio'],
        data['peso']);

      result.push(repartidor);
    });

    return result;
  }

  async createIceCreamAsync(objeto: Icecream) {
    try {
      // Create a DocumentReference by combining the collection reference and document name
      const heladoDocRef = doc(this.helados, objeto.nombre);

      // Use setDoc with the DocumentReference to set the document
      await setDoc(heladoDocRef, {
        tipo: objeto.tipo,
        precio: objeto.precio,
        peso: objeto.peso
      });
    } catch (err: any) {
      throw err;
    }
  }

  async deleteIceCreamAsync(objeto: Icecream) {
    try {
      // Create a DocumentReference by combining the collection reference and document name
      const heladoDocRef = doc(this.helados, objeto.nombre);

      // Use deleteDoc with the DocumentReference to delete the document
      await deleteDoc(heladoDocRef);
    } catch (err: any) {
      throw err;
    }
  }

  async upDateIceCreamAsync(objeto: Icecream) {
    try {
      // Create a DocumentReference by combining the collection reference and document name
      const heladoDocRef = doc(this.helados, objeto.nombre);

      // Use updateDoc with the DocumentReference to update the document
      await updateDoc(heladoDocRef, {
        tipo: objeto.tipo,
        precio: objeto.precio,
        peso: objeto.peso
      });
    } catch (err: any) {
      throw err;
    }
  }

}