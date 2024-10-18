import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaisRepartidorComponent } from './pais-repartidor.component';

describe('PaisRepartidorComponent', () => {
  let component: PaisRepartidorComponent;
  let fixture: ComponentFixture<PaisRepartidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaisRepartidorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaisRepartidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
