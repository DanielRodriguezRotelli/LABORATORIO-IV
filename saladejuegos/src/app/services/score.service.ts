import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private selectedGameSource = new BehaviorSubject<string | null>(null); // BehaviorSubject mantiene el último valor emitido
  selectedGame$ = this.selectedGameSource.asObservable(); // Creamos un observable para suscribirse a los cambios

  // Método para actualizar el juego seleccionado
  setSelectedGame(game: string | null) {
    console.log('setSelectedGame:', game); // Verifica si este console.log se imprime
    this.selectedGameSource.next(game); // Aquí llamamos a next() en el BehaviorSubject, no en el observable
  }
}
