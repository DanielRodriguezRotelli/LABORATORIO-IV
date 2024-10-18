import { Injectable, Query } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, Firestore, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Repartidor } from '../models/repartidor';


@Injectable({
  providedIn: 'root'
})
export class DealerService {

  collectionName: string = 'repartidores';

  constructor(private firestore: Firestore) {}

  getDeliveryPersons(): Observable<Repartidor[]> {
    const dealerRef: CollectionReference = collection(
      this.firestore,
      this.collectionName
    );
    const deliveryQuery = query(dealerRef);
    return collectionData(deliveryQuery) as Observable<Repartidor[]>;
  }

  updateDeliveryPersons(
    nombre: string,
    dni: number,
    edad: number,
    capacidad: number,
    unidadPropia: boolean,
    pais: string
  ) {
    const newDeliveryPerson: Repartidor = {
      nombre: nombre,
      dni: dni,  
      edad: edad,
      capacidad: capacidad,
      unidadPropia: unidadPropia,
      pais: pais,
    };
    const deliveryPersonsRef = collection(this.firestore, this.collectionName);
    addDoc(deliveryPersonsRef, newDeliveryPerson);
  }
}
