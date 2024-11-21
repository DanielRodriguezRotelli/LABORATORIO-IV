import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './bienvenida.component.html',
  styleUrl: './bienvenida.component.css',
  animations: [
    trigger ('arribaHaciaAbajo', [
      state('arriba', style({
        transform: 'translateY(-2000px)',
        opacity: 0.8,
        overflow: 'hidden'
      })),
      state('abajo', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('arriba => abajo', [animate('2s')]),
    ])
  ]
})
export class BienvenidaComponent implements OnInit{
  
  public estadoAnimacion: string = 'arriba';
  ngOnInit(): void
  {
    setTimeout(() => {
      this.estadoAnimacion = 'abajo';
      
    }, 500);
  }
}


