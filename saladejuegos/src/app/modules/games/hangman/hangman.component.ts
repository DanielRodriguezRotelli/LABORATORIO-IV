import { Component } from '@angular/core';

@Component({
  selector: 'app-hangman',
  standalone: false,
  templateUrl: './hangman.component.html',
  styleUrls: ['./hangman.component.css'] // Corregido el nombre de la propiedad
})
export class HangmanComponent {
  alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  words: string[] = ["perro", "gato", "mesa", "silla", "ventana", "puerta", "cocina", "libro", "escuela", "jardin", "flor", "arbol", "ciudad", "carro", 
  "bicicleta", "cielo", "nube", "rio", "montaña", "playa", "amigo", "familia", "comida", "cafe", "sol", "luna", "estrella", "cama", 
  "telefono", "camino", "bosque", "planta", "noche", "dia", "aire", "agua", "fuego", "tierra", "sueño", "luz", "felicidad", "sonrisa", 
  "corazon", "mano", "ojo", "cielo", "zapato", "camisa", "pelota", "auto"];
  
  points: number = 0;
  word = this.getNewWord();
  guessedLetters: string[] = [];
  rightWordsCounter = 0;
  attempts = 6;
  showNextButton: boolean = false; 
  showNotification: boolean = false; 
  wordGuessed: boolean = false;

  guessLetter(letter: string) {
    this.guessedLetters.push(letter);
    if (!this.word.includes(letter)) {
      this.attempts--;
    }
    const button = document.getElementById('letter-' + letter) as HTMLElement;
    if (button) {
      button.style.visibility = 'hidden';
    }
    
    if (this.attempts === 0) {
      console.log('Attempts reached 0, showing notification.');
      this.showNotification = true; // Mostrar la notificación
    }
  }

  getNewWord() {
    return this.words[Math.floor(Math.random() * this.words.length)].toUpperCase();
  }

  getDisplayWord() {
    let display = '';
    for (let letter of this.word) {
      display += this.guessedLetters.includes(letter) ? letter : '_';
    }
    if (!display.includes('_') && !this.wordGuessed) {
      this.wordGuessed = true;
      this.points++;
      
      setTimeout(() => {
        this.showNextButton = true;
        const alphabetContainer = document.getElementById('alphabet-container') as HTMLElement;
        if (alphabetContainer) {
          alphabetContainer.style.visibility = 'hidden';
        }
      }, 0); // Usamos un setTimeout de 0 para evitar problemas de detección de cambios
    }
    return display;
  }

  resetWord() {
    this.attempts = 6;
    this.guessedLetters = [];
    this.word = this.getNewWord();
    this.showNextButton = false;
    this.showNotification = false;
    this.wordGuessed = false; // Reiniciar el estado

    const alphabetContainer = document.getElementById('alphabet-container') as HTMLElement;
    if (alphabetContainer) {
      alphabetContainer.style.visibility = 'visible';
    } else {
      console.error('alphabet-container no encontrado');
    }

    // Hacer que todos los botones del teclado sean visibles nuevamente
    for (let letter of this.alphabet) {
      const button = document.getElementById('letter-' + letter) as HTMLElement;
      if (button) {
        button.style.visibility = 'visible';
      }
    }
  }

  resetGame() {
    this.rightWordsCounter = 0;
    this.resetWord();
  }

  hideNotification() {
    this.showNotification = false;
    this.resetGame();
  }

  nextClick() {
    this.showNextButton = false; 
    setTimeout(() => { 
      this.rightWordsCounter++;
      this.resetWord();
    }, 0); // Evitar problemas de detección de cambios
  }
}
