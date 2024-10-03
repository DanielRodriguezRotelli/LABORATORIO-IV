import { Component } from '@angular/core';
import { CountryService } from '../../../services/country/country.service';
import { Auth } from '@angular/fire/auth';


@Component({
  selector: 'app-questions',
  standalone: false,
  //imports: [],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent {
  flagUrl: string = '';
  options: string[] = [];
  correctOptionIndex?: number;
  userScore: number = 0;
  userMistakes: number = 0;
  questionsAnswered = 0;
  totalQuestions = 11; // total number of questions
  loggedUser: any;
  shownCountries: Set<string> = new Set(); // Almacena los nombres de los países ya mostrados
  currentQuestionOptions: string[] = [];// Keep track of options for the current question
  public showEndGameMessage: boolean = false; // Controla la visibilidad del mensaje
  public endGameMessage: string = ''; // Mensaje que se mostrará

  constructor(
    private countryService: CountryService,
    public auth: Auth
    //private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.startNewQuiz();

    const user = this.auth.currentUser;
    //const user = this.authService.getLoggedUser();
    if (user) {
      this.loggedUser = user;
    }
  }

  startNewQuiz(): void {
    this.countryService.getCountries().subscribe((countries) => {
      // Filtrar los países que ya han sido mostrados
      const availableCountries = countries.filter(country => !this.shownCountries.has(country.name));

      if (availableCountries.length === 0) {
        // No hay más países disponibles
        this.endGameMessage = `¡Fin del juego!`;
        this.showEndGameMessage = true; // Mostrar el mensaje
        return; // Salimos del método si no hay más países
      }

      const randomIndex = Math.floor(Math.random() * availableCountries.length);
      const randomCountry = availableCountries[randomIndex];

      this.flagUrl = randomCountry.flag;

      // Agregar el país mostrado al conjunto
      this.shownCountries.add(randomCountry.name);

      // Generar opciones incorrectas (nombres de países aleatorios)
      this.generateIncorrectOptions(availableCountries, randomCountry.name);

      // Asignar la opción correcta a una posición aleatoria
      this.correctOptionIndex = Math.floor(Math.random() * 4);
      this.options[this.correctOptionIndex] = randomCountry.name;

      // Almacenar las opciones para la pregunta actual
      this.currentQuestionOptions = this.options.slice();
    });
  }

  // Generate three random incorrect options (country names)
  generateIncorrectOptions(countries: any[], correctName: string): void {
    const incorrectCountries = countries.filter(country => country.name !== correctName && !this.shownCountries.has(country.name));
    const randomCountries = this.shuffleArray(incorrectCountries).slice(0, 4);
    // Asigna las opciones incorrectas
    this.options = []; // Reiniciar las opciones
    randomCountries.forEach((country, index) => {
        this.options[index] = country.name;
    });
  }

  // Shuffle an array (Fisher-Yates algorithm)
  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Check if the user's answer is correct
  checkAnswer(selectedIndex: number): void {
    if (selectedIndex === this.correctOptionIndex) {
      // User's answer is correct, increment the score
      this.userScore++;
    }else {
      this.userMistakes++; // Aumenta el conteo de desaciertos
    }

    this.questionsAnswered++;

    if (this.questionsAnswered >= this.totalQuestions) {
      this.endGame();
    } else {
      this.startNewQuiz();
    }
  }

  resetGame(): void {
    this.userScore = 0;
    this.userMistakes = 0;
    this.questionsAnswered = 0;
    this.shownCountries.clear(); // Limpiar los países mostrados
    this.showEndGameMessage = false; // Oculta el mensaje de fin de juego
    this.startNewQuiz(); // Inicia un nuevo cuestionario
  }


  endGame(): void {
    this.endGameMessage = `¡Fin del juego!`;
    this.showEndGameMessage = true; // Muestra el mensaje
  }
}
