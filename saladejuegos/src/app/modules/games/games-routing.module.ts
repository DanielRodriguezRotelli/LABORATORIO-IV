import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HangmanComponent } from './hangman/hangman.component';
import { QuestionsComponent } from './questions/questions.component';
import { GreaterorlessComponent } from './greaterorless/greaterorless.component';
import { BattleshipComponent } from './battleship/battleship.component';

const routes: Routes = [
  { path: 'hangman', component: HangmanComponent },
  { path: 'questions', component: QuestionsComponent },
  { path: 'battleship', component: BattleshipComponent },
  { path: 'greater', component: GreaterorlessComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
