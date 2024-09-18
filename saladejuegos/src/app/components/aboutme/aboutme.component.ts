import { Component } from '@angular/core';

@Component({
  selector: 'app-aboutme',
  standalone: true,
  imports: [],
  templateUrl: './aboutme.component.html',
  styleUrl: './aboutme.component.css'
})
export class AboutmeComponent {
   name: string = "Daniel Rodriguez Rotelli";
   mail: string = "daniel.rodriguez.rotelli@gmail.com";
   link: string = "https://www.linkedin.com/in/danielrodríguezrotelli";
   title1: string = "Profesor de Musica - EMPA";
   title2: string = "Estudiante de Programación - UTN";
   Description1: string ="Docente de Música en escuelas secundarias. Músico sesionista. Arreglador musical.";
   Description2: string ="Buscando y descubriendo nuevos rumbos. Compromiso y dedicación para aprender y adaptarme a nuevos desafíos.";
}
