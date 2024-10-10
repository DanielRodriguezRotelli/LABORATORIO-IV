import { Timestamp } from '@angular/fire/firestore';

export interface Survey {
    userMail: string; // mail del usuario logueado
    name: string;
    age: number; // Edad del usuario
    phone: string; // Número de teléfono del usuario
    responses: SurveyResponse[]; // Respuestas a las preguntas
    date: Timestamp; // Fecha y hora de la encuesta
}

export interface SurveyResponse {
    questions: string; // ID de la pregunta
    answer: string; // Respuesta para preguntas de tipo texto
    
}
