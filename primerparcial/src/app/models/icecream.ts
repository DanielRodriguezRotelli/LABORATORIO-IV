export class Icecream {
    public nombre: string;
    public tipo: string;
    public precio: number;
    public peso: number;
  
    constructor(
      nombre: string,
      tipo: string,
      precio: number,
      peso: number
    ) {
      this.nombre = nombre;
      this.tipo = tipo;
      this.precio = precio;
      this.peso = peso;
    }
  }