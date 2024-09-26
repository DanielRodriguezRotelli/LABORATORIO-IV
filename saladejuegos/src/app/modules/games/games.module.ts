import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamesRoutingModule } from './games-routing.module';
import { HangmanComponent } from './hangman/hangman.component';


@NgModule({
  declarations: [HangmanComponent],
  imports: [
    CommonModule,
    GamesRoutingModule
  ]
})
export class GamesModule { }
