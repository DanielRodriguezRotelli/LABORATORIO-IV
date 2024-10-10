import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Timestamp, orderBy, query, where } from 'firebase/firestore';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-game-scores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-scores.component.html',
  styleUrl: './game-scores.component.css'
})
export class GameScoresComponent implements OnInit {
  games = ['', 'hangman', 'greater', 'questions', 'battleship'];
  listScore: any[] = [];
  selectedGame: string | null = null;
  dateOptions : Intl.DateTimeFormatOptions = { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };


  constructor ( private firestore: Firestore,
                private auth: Auth,
                private router: Router,
                private scoreService: ScoreService){}

  ngOnInit(): void {
    console.log('ngOnInit inicializado'); // Verifica si esto se imprime
    this.scoreService.selectedGame$.subscribe(game => {
      console.log('Juego seleccionado:', game); // Este debería imprimirse, incluso si es null
      this.loadScores(game ?? undefined); // Carga resultados basados en el juego seleccionado
    });
  
    // Si deseas cargar todos los resultados cuando no se ha seleccionado un juego, puedes mantener esto
    //this.loadScores();
  }


  loadScores(game?: string) {
    let col = collection(this.firestore, 'score');
  
    // Preparar la consulta básica
    let orderQuery = query(col, orderBy('score', 'desc'));

    // Si se proporciona un juego, añade el filtro
    if (game) {
        orderQuery = query(col, where('gameName', '==', game), orderBy('score', 'desc'));
    }
  
    const observable = collectionData(orderQuery);
  
    observable.subscribe({
      next: (respuesta: any) => {
        console.log(respuesta); // Verifica los datos obtenidos
          if (respuesta.length === 0) {
              this.listScore = [];
          } else {
              this.listScore = respuesta;
          }
      },
      error: (error) => {
          console.error('Error al cargar los puntajes:', error);
          this.listScore = []; // Si hay un error, también muestra "No hay resultados aún"
      }
  });
  
  }
  


  getLocaleString(date: Timestamp){
    return new Date(date.seconds*1000).toLocaleString('es-AR', this.dateOptions);
  }

}
