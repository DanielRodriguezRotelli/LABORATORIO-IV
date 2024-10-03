import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleshipPlayerComponent } from './battleship-player.component';

describe('BattleshipPlayerComponent', () => {
  let component: BattleshipPlayerComponent;
  let fixture: ComponentFixture<BattleshipPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattleshipPlayerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BattleshipPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
