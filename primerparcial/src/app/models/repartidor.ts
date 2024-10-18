export class Repartidor {
    dni?: number;
    nombre?: string;
    edad?: number;
    capacidad?: number;
    pais?: string;
    unidadPropia?: boolean;
  
    constructor(
      dni?: number,
      nombre?: string,
      edad?: number,
      capacidad?: number,
      pais?: string,
      unidadPropia?: boolean
    ) {
      this.dni = dni;
      this.nombre = nombre;
      this.edad = edad;
      this.capacidad = capacidad;
      this.pais = pais;
      this.unidadPropia = unidadPropia;
    }
  }