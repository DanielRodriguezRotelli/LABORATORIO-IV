export class Ship {
    size: number;
    hits: number;
    occupiedCells: { x: number, y: number }[] = [];
    //count: number; // Nueva propiedad para el conteo de barcos
    //name: string; // Nueva propiedad para el nombre del barco

  
    constructor(size: number) {
      this.size = size;
      this.hits = 0; // Inicialmente no ha sido golpeado
      //this.count = count; // Inicializar el conteo.
      //this.name = name; // Inicializar el nombre
    }
  
    // Método para saber si el barco está hundido
    isSunk(): boolean {
      return this.hits === this.size;
    }
  }
  
 