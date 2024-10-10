import { Timestamp } from "@angular/fire/firestore";

export interface GameScore {
    userName: string;  // Nombre del usuario
    gameName: string;  // Nombre del juego (Ahorcado, Battleship, etc.)
    date: Timestamp;  // Fecha y hora del resultado
    score: number;  // Puntaje del usuario
  }