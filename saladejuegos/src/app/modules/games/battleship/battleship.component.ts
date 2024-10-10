import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { HomeComponent } from '../../../components/home/home.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { Ship } from '../../../models/ship';
import { User as FirebaseUser } from '@firebase/auth';
import { User } from '../../../models/user';
import { GameScore } from '../../../models/gamesScores';
import { addDoc, collection, Firestore, Timestamp } from '@angular/fire/firestore';

// Definir una interfaz para las celdas del tablero
interface BoardCell {
  hasShip: boolean;
  isHit: boolean;
  mark?: 'X' | 'O'; // Añadir propiedad para marcar la celda
  shipId?: number;  // Para asociar la celda a un barco específico
}

@Component({
  selector: 'app-battleship',
  standalone: false,
  //imports: [HomeComponent, CommonModule, RouterLink],
  templateUrl: './battleship.component.html',
  styleUrls: ['./battleship.component.css'],
})
export class BattleshipComponent {

  playerBoard: BoardCell[][];
  opponentBoard: BoardCell[][];
  userScore: number = 0;
  player1: string = "";
  currentPlayer: string = "";
  playerShipsFloat: number = 7;
  opponentShipsFloat: number = 7;
  boardSize: number = 10;
  attackMessage: string ="";
  wingMessage: string ="";
  gameOver: boolean = false; // Inicializar como falso al comenzar el juego

  // Definir la flota de cada jugador
  playerFleet = [
    new Ship(5),  // Portaaviones
    new Ship(4),  // Destructor
    new Ship(3),  // Submarino
    new Ship(3),  // Submarino
    new Ship(2),  // Crucero
    new Ship(2),  // Crucero
    new Ship(2),  // Crucero
  ];


  // Posiciones de los barcos en el tablero del jugador
  userShips: string[] = []; // Cambia estos valores según tus barcos


  constructor(public auth: Auth, 
              private cdr: ChangeDetectorRef,
              private firestore: Firestore) {

    this.player1 = this.auth.currentUser?.email?.split('@')[0] || ""; // Puede ser un string vacio
    this.playerBoard = this.createBoard(); // Inicializa el tablero del jugador
    this.opponentBoard = this.createBoard(); // Inicializa el tablero del oponente

    if (this.player1 !== "") {
      this.initializeBoards(); // Inicializa barcos en los tableros
      this.startGame(); // Comienza el juego aleatoriamente
    } else {
        console.error("No hay usuario autenticado.");
        // Manejar la lógica para un usuario no autenticado, como redirigir a la página de login.
    }
  }

  startGame() {
    // Decide aleatoriamente quién comienza el juego
    this.currentPlayer = Math.random() < 0.5 ? this.player1 : 'computer';
    console.log(`El jugador que comienza es: ${this.currentPlayer}`);

    // Si le toca a la computadora, ejecuta su jugada inmediatamente
    if (this.currentPlayer === 'computer') {
      setTimeout(() => this.computerMove(), 3000);
    }
  }

  initializeBoards() {
    console.log("Inicializando tableros...");
    this.placeShips(this.playerBoard);
    this.placeShips(this.opponentBoard);
  }

  // Crear un tablero vacío
  createBoard(): BoardCell[][] {
    console.log("Creando el tablero..."); // log para ver si llama al metodo

    const board: BoardCell[][] = [];
    for (let i = 0; i < this.boardSize; i++) {
      const row: BoardCell[] = [];
      for (let j = 0; j < this.boardSize; j++) {
        row.push({ hasShip: false, isHit: false });
      }
      board.push(row);
    }
    console.log("Tablero creado:", board); // log para ver el tablero
    return board;
  }

  // Método para colocar los barcos en el tablero
  placeShips(board: BoardCell[][]) {
    console.log("Colocando los barcos en el tablero..."); // log para ver si llama al metodo

    this.playerFleet.forEach((ship, index) => {
      let placed = false;
      while (!placed) {
        const direction: string = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const row = Math.floor(Math.random() * this.boardSize);
        const col = Math.floor(Math.random() * this.boardSize);

        if (this.canPlaceShip(board, row, col, ship.size, direction)) {
          this.addShip(board, row, col, ship.size, direction, index); // Añadimos un 'shipId'
          placed = true;
        }
      }
    });
  }

  // Verificar si se puede colocar un barco en la posición dada
  canPlaceShip(board: BoardCell[][], row: number, col: number, size: number, direction: string): boolean {
    if (direction === 'horizontal') {
      if (col + size > this.boardSize) return false; // Fuera de los límites
      for (let i = 0; i < size; i++) {
        if (board[row][col + i].hasShip) return false; // Ya hay un barco
        // Verificar celdas adyacentes (arriba y abajo)
        if (row > 0 && board[row - 1][col + i].hasShip) return false; // Arriba
        if (row < this.boardSize - 1 && board[row + 1][col + i].hasShip) return false; // Abajo
      }
      // Verificar celdas a la izquierda y derecha
      if (col > 0 && board[row][col - 1].hasShip) return false; // Izquierda
      if (col + size < this.boardSize && board[row][col + size].hasShip) return false; // Derecha
    } else { // vertical
      if (row + size > this.boardSize) return false; // Fuera de los límites
      for (let i = 0; i < size; i++) {
        if (board[row + i][col].hasShip) return false; // Ya hay un barco
        // Verificar celdas adyacentes (izquierda y derecha)
        if (col > 0 && board[row + i][col - 1].hasShip) return false; // Izquierda
        if (col < this.boardSize - 1 && board[row + i][col + 1].hasShip) return false; // Derecha
      }
      // Verificar celdas arriba y abajo
      if (row > 0 && board[row - 1][col].hasShip) return false; // Arriba
      if (row + size < this.boardSize && board[row + size][col].hasShip) return false; // Abajo
    }
    return true; // Se puede colocar el barco
  }


  // Añadir un barco al tablero
  addShip(board: BoardCell[][], row: number, col: number, size: number, direction: string, shipId: number) {
    if (direction === 'horizontal') {
      for (let i = 0; i < size; i++) {
        board[row][col + i].hasShip = true;
        board[row][col + i].shipId = shipId; // Identificamos qué barco ocupa esta celda
      }
    } else {
      for (let i = 0; i < size; i++) {
        board[row + i][col].hasShip = true;
        board[row + i][col].shipId = shipId;
      }
    }
  }

  // Movimiento aleatorio de compu
  computerMove() {
    if (this.currentPlayer === 'computer') {
      let i, j;
      do {
        i = Math.floor(Math.random() * this.boardSize);
        j = Math.floor(Math.random() * this.boardSize);
      } while (this.playerBoard[i][j].isHit); // Asegurarse de que la celda no haya sido ya golpeada

    // Llama a selectCell para aplicar la jugada de la computadora
    this.selectCell(i, j, 'User');
    
    // Forzar la detección de cambios en el tablero del jugador
    this.cdr.detectChanges();
    }
  }


   // Eleccion de celda
  selectCell(i: number, j: number, board: 'User' | 'computer') {
    if (this.gameOver) {
      console.log('el juego está terminado');
      return;
    }
    console.log(`Celda: (${i}, ${j}), Player: ${this.currentPlayer}, en ${board} `);

    // Asegúrate de que no se permita hacer clic en celdas ya impactadas
    const selectedBoard = board === 'User' ? this.playerBoard : this.opponentBoard;
    if (selectedBoard[i][j].isHit) return; // Evita hacer clic en celdas ya impactadas
  
     // Marca la celda como golpeada
    selectedBoard[i][j].isHit = true;
  
    // Actualizar el valor de 'mark' para mostrar 'X' o 'O'
    selectedBoard[i][j].mark = selectedBoard[i][j].hasShip ? 'X' : 'O';
  
    // Determina si hay un barco en la celda
    if (selectedBoard[i][j].hasShip) {
      this.attackMessage = "TOCADO";

      // Verificar si se ha hundido el barco
      const shipId = selectedBoard[i][j].shipId;
      if (shipId !== undefined && this.isShipSunk(selectedBoard, shipId)) {
        this.attackMessage = "HUNDIDO";
        this.updateShipsFloat(board);
      }
    } else {
      this.attackMessage = "AGUA";
    }

    // Aquí llamas a detectChanges después de haber actualizado el estado de la celda
    this.cdr.detectChanges();
    
    // Condición de victoria
    this.checkWinCondition();
    
    // Cambiar el turno
    this.switchTurn();
  }

   // Cambio de turno
  switchTurn() {
    this.currentPlayer = this.currentPlayer === this.player1 ? 'computer' : this.player1;
    if (this.currentPlayer === 'computer') {
      setTimeout(() => this.computerMove(), 2000);
    }
  }

   // Comprueba si el barco esta hundido
  isShipSunk(board: BoardCell[][], shipId: number): boolean {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (board[i][j].shipId === shipId && !board[i][j].isHit) {
          return false;
        }
      }
    }
    return true; // El barco está completamente hundido
  }

   // Resta celda al barco
  updateShipsFloat(board: 'User' | 'computer') {
    if (board === this.player1) {
      this.playerShipsFloat--;
    } else {
      this.opponentShipsFloat--;
    }
  }
  
   // Chequea si hay un ganador
  checkWinCondition() {
    if (this.playerShipsFloat === 0) {
      this.wingMessage ='¡La computadora ha ganado!';
      this.gameOver = true; // El juego ha terminado, bloquear el tablero
      if (this.userScore !== 0) {
        this.saveScore(); 
      }
    } else if (this.opponentShipsFloat === 0) {
      this.wingMessage ='¡Has ganado!';
      this.userScore += 5;
      this.gameOver = true; // El juego ha terminado, bloquear el tablero
      this.saveScore();
    }
    //this.showNotificationWinner = true;
  }

  restartGame() {
    if (this.wingMessage ==='¡La computadora ha ganado!') {
      this.userScore = 0;
    }
    console.log("Reiniciando el juego...");
    this.playerShipsFloat = 7;
    this.opponentShipsFloat = 7;
    this.currentPlayer = this.currentPlayer = Math.random() < 0.5 ? this.player1 : 'computer'; // Jugador aleatorio';
    this.playerBoard = this.createBoard(); // Inicializa el tablero del jugador
    this.opponentBoard = this.createBoard(); // Inicializa el tablero del oponente
    this.gameOver = false;
    this.attackMessage = "";
    this.wingMessage = "";
    this.initializeBoards(); // Re-inicializa el juego
    this.startGame();
  }


  getCoordinate(i: number, j: number): string {
    const letters = 'ABCDEFGHIJ';
    return `${letters[i]}${j + 1}`;
  }

  saveScore(): void {
    const currentUser = this.auth.currentUser?.email;

    if (currentUser) {
      
      // Guardar el resultado en Firestore
      const result: GameScore = {
        userName: currentUser || "Unknown",
        gameName: "Batalla Naval",
        date: Timestamp.fromDate(new Date),
        score: this.userScore 
      };

      let col = collection(this.firestore, 'score');
      addDoc(col, result)
    }
  }

}