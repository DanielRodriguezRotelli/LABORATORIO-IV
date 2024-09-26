import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DeckResponse } from '../models/cards';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  http = inject(HttpClient);

  constructor() { }

  getCard(deck: string | null) {
    return this.http.get<DeckResponse>('https://www.deckofcardsapi.com/api/deck/'+ (deck? deck : "new") +'/draw/?count=1')
  }
  
}