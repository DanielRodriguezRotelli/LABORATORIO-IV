import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, Firestore, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Driver } from '../models/driver';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  collectionName: string = 'choferes';

  constructor(private firestore: Firestore) {}

  getDriverPersons(): Observable<Driver[]> {
    const driverRef: CollectionReference = collection(
      this.firestore,
      this.collectionName
    );
    const driverQuery = query(driverRef);
    return collectionData(driverQuery) as Observable<Driver[]>;
  }

  updateDriverPersons(
    nombre: string,
    dni: number,
    edad: number,
    numeroLicencia: number,
    licenciaProfesional: boolean,
    pais: string
  ) {
    const newDriverPerson: Driver = {
      nombre: nombre,
      dni: dni,  
      edad: edad,
      numeroLicencia: numeroLicencia,
      licenciaProfesional: licenciaProfesional,
      pais: pais,
    };
    const driverPersonsRef = collection(this.firestore, this.collectionName);
    addDoc(driverPersonsRef, newDriverPerson);
  }
}
