import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesRoutingModule } from './games-routing.module';
import { HangmanComponent } from './hangman/hangman.component';
import { HttpClientModule } from '@angular/common/http';
import { QuestionsComponent } from './questions/questions.component';
import { GreaterorlessComponent } from './greaterorless/greaterorless.component';
import { BattleshipComponent } from './battleship/battleship.component';




@NgModule({
  declarations: [HangmanComponent, QuestionsComponent, GreaterorlessComponent, BattleshipComponent],
  imports: [
    CommonModule,
    GamesRoutingModule,
    HttpClientModule
  ]
})
export class GamesModule { }
