export class Vehicle {
    public id?: string;
    public name: string;
    public type: string;
    public cantidadDeRuedas: number;
    public capacidad: number;
  
    constructor(
        name: string,
        type: string,
        cantidadDeRuedas: number,
        capacidad: number,
        id?: string
    ) {
      this.id = id;
      this.name = name;
      this.type = type;
      this.cantidadDeRuedas = cantidadDeRuedas;
      this.capacidad = capacidad;
    }
  }