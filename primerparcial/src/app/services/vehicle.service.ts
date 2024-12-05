import { Injectable } from '@angular/core';
import { addDoc, collection, CollectionReference, deleteDoc, doc, DocumentData, Firestore, getDocs, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { Vehicle } from '../models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private vehiculos: CollectionReference<DocumentData>;
  //private collectionName: string = 'vehiculos';


  constructor(private firestore: Firestore) {
    this.vehiculos = collection(this.firestore, 'vehiculos');
  }
  
  async getVehicleAsync() {
    const querySnapshot = await getDocs(query(this.vehiculos));
    const result: Vehicle[] = [];

    querySnapshot.forEach(document => {
      const data = document.data();

      const vehiculo = new Vehicle(
        data['nombre'],
        data['tipo'],
        data['cantidadDeRuedas'],
        data['capacidad'],
        document.id,);

      result.push(vehiculo);
    });
    console.log('Vehiculos traidos : ', result);
    return result;
    
  }

  async createVehicleAsync(objeto: Vehicle) {
    try {
      // Create a DocumentReference by combining the collection reference and document name
      //const vehiculoDocRef = doc(this.vehiculos, objeto.name);

      // Use setDoc with the DocumentReference to set the document
      await addDoc(this.vehiculos, {
        nombre: objeto.name,
        tipo: objeto.type,
        cantidadDeRuedas: objeto.cantidadDeRuedas,
        capacidad: objeto.capacidad
      });
    } catch (err: any) {
      throw err;
    }
  }

  /*
  deleteVehicle(id: string) {
    const dataRef = doc(this.firestore, this.collectionName, id);
    deleteDoc(dataRef);
  }*/

  async deleteVehicleAsync(objeto: Vehicle) {
    console.log('Borrar Vehiculo ID: ', objeto);
    try {

      // Create a DocumentReference by combining the collection reference and document name
      const vehiculoDocRef = doc(this.vehiculos, objeto.id);

      console.log('vehiculoDocRef: ', vehiculoDocRef);
      // Use deleteDoc with the DocumentReference to delete the document
      await deleteDoc(vehiculoDocRef);
    } catch (err: any) {
      throw err;
    }
  }

  async upDateVehicleAsync(objeto: Vehicle) {
    console.log('Modificar Vehiculo ID: ', objeto.id);
    try {
      // Create a DocumentReference by combining the collection reference and document name
      const vehiculoDocRef = doc(this.vehiculos, objeto.id);

      console.log('vehiculoDocRef: ', vehiculoDocRef);
      // Use updateDoc with the DocumentReference to update the document
      await updateDoc(vehiculoDocRef, {
        nombre: objeto.name,
        tipo: objeto.type,
        cantidadDeRuedas: objeto.cantidadDeRuedas,
        capacidad: objeto.capacidad
      });
    } catch (err: any) {
      throw err;
    }
  }
}
