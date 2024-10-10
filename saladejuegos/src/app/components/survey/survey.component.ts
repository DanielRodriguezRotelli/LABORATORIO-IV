import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { Firestore, addDoc, collection, Timestamp } from '@angular/fire/firestore';


@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})

export class SurveyComponent implements OnInit{
  isChecked: boolean = false;
  flagError: boolean = false;
  notification: string = "";
  surveyForm!: FormGroup;
  showSurveyModal: boolean = false;

  options1: any[] = [
    {label: 'Si', value: 'Si'},
    {label: 'No', value: 'No'},
  ];

  // Array de preguntas para la encuesta
  questions: string[] = [
    '¿Disfrutas jugar con videojuegos?',
    '¿Cuál es tu juego favorito?',
    '¿Qué géneros de juegos prefieres?'
  ];

  options3: any[] = [
    {label: 'Estrategia ', value: 'Estrategia '},
    {label: 'Acción-aventura', value: 'Acción-aventura'},
    {label: 'Simulación y deportes', value: 'Simulación y deportes'},
    {label: 'Puzzles ', value: 'Puzzles '},
    {label: 'Shooters  ', value: 'Shooters  '},
  ];

  constructor(private fb: FormBuilder, 
              private router: Router,
              public auth: Auth, 
              private firestore: Firestore) {}

  // Inicializa el formulario con validaciones
  ngOnInit(){
    this.surveyForm = this.fb.group({
      name: ['', [Validators.pattern('^[a-zA-Z]+\\s[a-zA-Z]+$'), Validators.required]],
      age: [10, [Validators.required, Validators.min(10), Validators.max(99)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{1,10}$/)]],
      answer1: ['', Validators.required], // Para radio
      answer2: ['', Validators.required], // Para texto
      answer3: this.fb.array([], Validators.required),  // Para checkbox
    });

    // Inicializamos los checkboxes en el FormArray
    this.options3.forEach(() => this.answer3Array.push(this.fb.control(false)));
  }

  // Getter para obtener el FormArray
  get answer3Array() {
  return this.surveyForm.get('answer3') as FormArray;
  }

  // Envío de la encuesta
  async submitSurvey() {
    console.log('Nombre:', this.surveyForm.get('name')?.value);
    console.log('Apellido:', this.surveyForm.get('lastName')?.value);
    console.log('Edad:', this.surveyForm.get('age')?.value);
    console.log('Teléfono:', this.surveyForm.get('phone')?.value);
    console.log('Respuesta 1:', this.surveyForm.get('answer1')?.value);
    console.log('Respuesta 2:', this.surveyForm.get('answer2')?.value);
    console.log('Respuesta 3:', this.surveyForm.get('answer3')?.value);
    console.log('Formulario válido:', this.surveyForm.valid);
    console.log('Estado del formulario:', this.surveyForm.status);
    console.log('Errores del formulario:', this.surveyForm.errors);

    // Filtramos las opciones seleccionadas en el checkbox
    const selectedOptions3 = this.options3
    .filter((_, index) => this.answer3Array.at(index).value) // Filtra solo los true
    .map(option => option.label); // Mapea a sus valores (label)
    
    const responses = [
        {
          questions: this.questions[0],
          answer: this.surveyForm.get('answer1')?.value
        },
        {
          questions: this.questions[1],
          answer: this.surveyForm.get('answer2')?.value
        },
        {
          questions: this.questions[2],
          answer: selectedOptions3,// Guarda las opciones seleccionadas
        },];
    
    console.log('Datos enviados:', responses); // Agrega este log
 
    if (this.surveyForm.valid) {
      try {
         // Guarda la encuesta en Firestore
         await this.saveSurvey(responses);

         // Llama al método para cerrar sesión
        await this.logout();

      } catch (error) {
        console.log('Error al enviar la encuesta o cerrar sesión:', error);
      }
    }else {
     console.log('Por favor, completa todos los campos correctamente.');
   }
  }

  // Método para guardar la encuesta en Firestore
  async saveSurvey(responses: any): Promise<void> {

    const currentUser = this.auth.currentUser?.email;

    if (currentUser) {
      const result = {
        userMail: currentUser,
        name: this.surveyForm.get('name')?.value, // Corrige aquí
        age: this.surveyForm.get('age')?.value,
        phone: this.surveyForm.get('phone')?.value,
        responses: responses,
        date: Timestamp.fromDate(new Date()),
      };

      const col = collection(this.firestore, 'survey');
      try {
        await addDoc(col, result);
        console.log('Encuesta guardada correctamente:', result);
      } catch (error) {
        console.error('Error al guardar la encuesta en Firestore:', error);
        throw error; // Lanza el error para manejarlo en submitSurvey
      }
    } else {
      console.error('No hay un usuario logueado');
      throw new Error('No hay un usuario logueado');
    }
  }

  // Método para cerrar sesión 
  logout() {
    this.showSurveyModal = false;
    signOut(this.auth).then(() => {
      this.flagError = false;
      this.goToHome();
    }).catch((e) => {
      this.flagError = true;
      console.log(e);
      switch (e.code) {
        case "auth/network-request-failed":
          this.notification = "Error de red. Verifica tu conexión a internet.";
          break;
        case "auth/internal-error":
          this.notification = "Ocurrió un error interno. Intenta nuevamente más tarde.";
          break;
        default:
          this.notification = "Error desconocido: " + e.message;
          break;
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}