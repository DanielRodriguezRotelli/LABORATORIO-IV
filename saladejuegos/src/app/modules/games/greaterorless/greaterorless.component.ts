import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Card } from '../../../models/cards';
import { CardsService } from '../../../services/cards/cards.service';
import { GameScore } from '../../../models/gamesScores';
import { addDoc, collection, Firestore, Timestamp } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-greaterorless',
  standalone: false,
  templateUrl: './greaterorless.component.html',
  styleUrls: ['./greaterorless.component.css'], // Corrige "styleUrl" a "styleUrls"
})
export class GreaterorlessComponent implements OnInit {

  @ViewChild('playButtons') playButtons!: ElementRef; // Cambia a ElementRef
  @ViewChild('startButton') startButton!: ElementRef; // Cambia a ElementRef
  private card: Card | undefined;
  userScore: number = 0;
  isPlaying = false;
  startImage = "https://img.freepik.com/foto-gratis/conceptual_1122-1955.jpg?t=st=1715655492~exp=1715659092~hmac=a806ed43b998f8bf90cfc710351a8cefa9cd6b2b60d3b2b047a9e04bcc8aae8e&w=740";
  image = this.startImage;
  deck: string | null = null;
  lifes = 5;
  gameOver = false; // Estado de juego
  message: string = "";

  constructor(private cardService: CardsService, 
              public auth: Auth, //private authService: AuthService
              private firestore: Firestore
  ) { }

  ngOnInit(): void {
    this.startGame();
  }

  ngAfterViewInit(): void {
      this.changeMode(this.isPlaying);
  }

  startGame() {
    this.cardService.getCard(this.deck).subscribe(response => {
      this.deck = response.deck_id;
      this.card = response.cards[0];
      this.image = this.card.image;
      this.isPlaying = true;
      this.userScore = 0;
      this.lifes = 5; // Reinicia las vidas
      this.gameOver = false; // Reinicia el estado del juego
      this.changeMode(this.isPlaying);
    });
  }

  play(option: string) {
    if (!this.isPlaying || this.gameOver) return; // Asegúrate de que el juego esté en curso

    this.cardService.getCard(this.deck).subscribe(response => {
      const newCard = response.cards[0];
      if (!this.card) return; // Verifica que `this.card` no sea indefinida

      // Verifica si la nueva carta es la misma que la actual
      if (newCard.value === this.card.value) {
        // Si son iguales, puedes decidir cómo manejarlo
        console.log("La nueva carta es la misma que la anterior. Obteniendo otra carta...");
        return; // O puedes llamar a `startGame()` de nuevo para obtener una nueva carta
      }

      switch (option) {
        case playOptions.Nuevo:
          this.startGame(); // Reinicia el juego
          break;
        case playOptions.Mayor:
          if (+this.getNumberValue(newCard.value)! > +this.getNumberValue(this.card!.value)!) {
            this.userScore++;
          } else {
            this.lifes--;
            if (this.lifes <= 0) {
              this.gameOver = true;
              this.isPlaying = false;
              this.image = this.startImage;
              this.message = "Game Over! No more lives.";
              this.saveScore();
            }
          }
          break;
        case playOptions.Menor:
          if (+this.getNumberValue(newCard.value)! < +this.getNumberValue(this.card!.value)!) {
            this.userScore++;
          } else {
            this.lifes--;
            if (this.lifes <= 0) {
              this.gameOver = true;
              this.isPlaying = false;
              this.image = this.startImage;
              this.message = "Game Over! No more lives.";
              this.saveScore();
            }
          }
          break;
      }

      // Actualiza la carta y la imagen después de la lógica
      console.log("points: " + this.userScore);
      this.changeMode(this.isPlaying);
      this.card = newCard;
      this.image = newCard.image;
    });
  }

  private changeMode(isPlaying: boolean) {
    if (this.playButtons && this.startButton) {
        if (isPlaying) {
            this.playButtons.nativeElement.style.visibility = 'visible';
            this.startButton.nativeElement.style.visibility = 'hidden';
        } else {
            this.startButton.nativeElement.style.visibility = 'visible';
            this.playButtons.nativeElement.style.visibility = 'hidden';
        }
    } else {
        console.error('Elementos no encontrados en el DOM');
    }
}


  private getNumberValue(value: string | undefined): string | undefined {
    switch (value) {
      case 'ACE': return '1';
      case 'JACK': return '11';
      case 'QUEEN': return '12';
      case 'KING': return '13';
      default: return value;
    }
  }


  saveScore(): void {
    const currentUser = this.auth.currentUser?.email;

    if (currentUser) {
      
      // Guardar el resultado en Firestore
      const result: GameScore = {
        userName: currentUser || "Unknown",
        gameName: "Mayor o Menor",
        date: Timestamp.fromDate(new Date),
        score: this.userScore 
      };

      let col = collection(this.firestore, 'score');
      addDoc(col, result)
    }
  }
}

enum playOptions {
  Mayor = "Mayor",
  Menor = "Menor",
  Nuevo = 'Nuevo'
}
