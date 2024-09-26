import { Component, OnInit } from '@angular/core';
import { Card } from '../../../models/cards';
import { CardsService } from '../../../services/cards.service';


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

  constructor(private cardService: CardsService){}

  ngOnInit(): void {
    this.changeMode(this.isPlaying);
  }

  play(option:string){
    this.cardService.getCard(this.deck).subscribe(response => {
      if(this.deck == null) this.deck = response.deck_id
      const newCard = response.cards[0]
      switch(option){
        case playOptions.Nuevo:
          this.isPlaying = true;
          this.points = 0;
          break;
        case playOptions.Mayor:
          if(+this.getNumberValue(newCard.value)! > + this.getNumberValue(this.card!.value)!){
            this.points++;
          }else if(+this.getNumberValue(newCard.value)! < +this.getNumberValue(this.card!.value)!){
            this.isPlaying = false
            this.image = this.startImage
            this.deck = null
          }
          break;
        case playOptions.Menor:
          if(+this.getNumberValue(newCard.value)! < +this.getNumberValue(this.card!.value)!){
            this.points++;
          }else if(+this.getNumberValue(newCard.value)! > +this.getNumberValue(this.card!.value)!){
            this.isPlaying = false
            this.image = this.startImage
            this.deck = null
          }
          break;
      }
      console.log("points: "+this.points);
      this.changeMode(this.isPlaying);
      this.card = newCard;
      this.image = newCard.image
    })
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