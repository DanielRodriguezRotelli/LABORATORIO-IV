import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaisDealerComponent } from './pais-dealer.component';

describe('PaisDealerComponent', () => {
  let component: PaisDealerComponent;
  let fixture: ComponentFixture<PaisDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaisDealerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaisDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
