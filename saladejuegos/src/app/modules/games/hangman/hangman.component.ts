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
  lifes = 3;
  attempts = 6;
  showNextButton: boolean = false; 
  showNotification: boolean = false; 
  wordGuessed: boolean = false;

  guessLetter(letter: string) {
    // Si la letra ya fue adivinada, no hacemos nada
    if (this.guessedLetters.includes(letter)) {
      return;
    }
  
    this.guessedLetters.push(letter);
  
    // Verifica si la letra no está en la palabra
    if (!this.word.includes(letter)) {
      this.attempts--; // Reduce los intentos
  
      // Si los intentos llegan a 0
      if (this.attempts === 0) {
        this.lifes--; // Resta una vida
        if (this.lifes === 0) {
          // Mostrar la notificación de Game Over
          this.showNotification = true; // Activar la notificación
          return;
        }
        
        this.revealWord(); // Revela la palabra al jugador
  
        // Oculta el teclado
        this.hideKeyboard();
  
        // Espera 3 segundos antes de mostrar una nueva palabra
        setTimeout(() => {
          this.resetWord(); // Restablece el juego con una nueva palabra
        }, 3000); // Espera 3 segundos (3000 milisegundos)
  
        return; // Salimos para evitar continuar la ejecución
      }
    }
  
    // Ocultar el botón de la letra seleccionada
    const button = document.getElementById('letter-' + letter) as HTMLElement;
    if (button) {
      button.style.visibility = 'hidden';
    }
  }
  
  

  // Método para revelar la palabra cuando los intentos llegan a 0
  revealWord() {
    // Reemplaza cada guion por la letra correcta de la palabra actual
    let revealedWord = '';
    for (let letter of this.word) {
      revealedWord += letter + ' ';
    }
  
    // Mostrar la palabra completa
    console.log(`La palabra correcta era: ${revealedWord.trim()}`);
  }
  

  getNewWord() {
    return this.words[Math.floor(Math.random() * this.words.length)].toUpperCase();
  }

  getDisplayWord() {
    let display = '';
  
    // Si los intentos llegan a 0, revela la palabra completa
    if (this.attempts === 0) {
      display = this.word; // Muestra la palabra completa si los intentos son 0
      this.hideKeyboard(); // Oculta el teclado
    } else {
      // Si aún hay intentos, muestra las letras adivinadas o guiones bajos
      for (let letter of this.word) {
        display += this.guessedLetters.includes(letter) ? letter : '_';
      }
  
      // Si la palabra fue completamente adivinada
      if (!display.includes('_') && !this.wordGuessed) {
        this.wordGuessed = true;
        this.points++;
        this.hideKeyboard(); // Oculta el teclado al adivinar la palabra
        this.showNextButton = true; // Muestra el botón "Next"
      }
    }
  
    return display.split('').join(' '); // Retorna la palabra con espacios entre las letras
  }
  
  
  hideKeyboard() {
    const alphabetContainer = document.getElementById('alphabet-container') as HTMLElement;
    if (alphabetContainer) {
      alphabetContainer.style.visibility = 'hidden'; // Asegúrate de que esto está ocultando el contenedor
    } else {
      console.error('alphabet-container no encontrado');
    }
  }
  

  resetWord() {
    this.attempts = 6;
    this.guessedLetters = [];
    this.word = this.getNewWord();
    this.wordGuessed = false; // Marca que la palabra no ha sido adivinada
    this.showNextButton = false; // Oculta el botón "Next" al comenzar una nueva palabra

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
    this.lifes = 3;
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
