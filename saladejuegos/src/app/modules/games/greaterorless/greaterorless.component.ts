import { Component, OnInit } from '@angular/core';
import { Card } from '../../../models/cards';
import { CardsService } from '../../../services/cards/cards.service';


@Component({
  selector: 'app-greaterorless',
  standalone: false,
  //imports: [],
  templateUrl: './greaterorless.component.html',
  styleUrl: './greaterorless.component.css'
})
export class GreaterorlessComponent implements OnInit{

  private card: Card | undefined

  points: number = 0
  isPlaying = false
  startImage = "https://img.freepik.com/foto-gratis/conceptual_1122-1955.jpg?t=st=1715655492~exp=1715659092~hmac=a806ed43b998f8bf90cfc710351a8cefa9cd6b2b60d3b2b047a9e04bcc8aae8e&w=740";
  image = this.startImage
  deck: string | null = null
  lifes = 5;
  gameOver = false; // Estado de juego
  message : string ="";


  constructor(private cardService: CardsService){}

  ngOnInit(): void {
    this.changeMode(this.isPlaying);
    this.startGame(); // Inicializa el juego
  }

  startGame() {
    this.cardService.getCard(this.deck).subscribe(response => {
      this.deck = response.deck_id;
      this.card = response.cards[0];
      this.image = this.card.image;
      this.isPlaying = true;
      this.points = 0;
      this.lifes = 5; // Reinicia las vidas
      this.changeMode(this.isPlaying);
    });
  }


  play(option:string){
    this.cardService.getCard(this.deck).subscribe(response => {
     const newCard = response.cards[0];
      if (!this.card) return; // Verifica que `this.card` no sea indefinida

      switch(option){
        case playOptions.Nuevo:
          this.startGame(); // Reinicia el juego
          break;
        case playOptions.Mayor:
          if(+this.getNumberValue(newCard.value)! > + this.getNumberValue(this.card!.value)!){
            this.points++;
          }else {
            this.lifes--;
            if (this.lifes <= 0) {
              this.gameOver = true;
              this.isPlaying = false;
              this.image = this.startImage;
              this.message ="Game Over! No more lives.";
            }
          }
          break;
        case playOptions.Menor:
          if(+this.getNumberValue(newCard.value)! < +this.getNumberValue(this.card!.value)!){
            this.points++;
          }else {
            this.lifes--;
            if (this.lifes <= 0) {
              this.gameOver = true;
              this.isPlaying = false;
              this.image = this.startImage;
              this.message ="Game Over! No more lives.";
            }
          }
          break;
      }
      console.log("points: "+this.points);
      this.changeMode(this.isPlaying);
      this.card = newCard;
      this.image = newCard.image
    });
  }

  private changeMode(isPlaying: boolean){
    const playButtons = document.getElementById('play-buttons') as HTMLElement;
    const startButton = document.getElementById('start-button') as HTMLElement;
    if(isPlaying){
      playButtons.style.visibility = 'visible';
      startButton.style.visibility = 'hidden';
    }else{
      startButton.style.visibility = 'visible';
      playButtons.style.visibility = 'hidden';
    }
  }

  private getNumberValue(value: string | undefined ): string | undefined {
    switch(value){
      case 'ACE': return '1';
      case 'JACK': return '11';
      case 'QUEEN': return '12';
      case 'KING': return '13';
      default: return value;
    } 
  }
}

enum playOptions {
  Mayor = "Mayor",
  Menor = "Menor",
  Nuevo = 'Nuevo'
}