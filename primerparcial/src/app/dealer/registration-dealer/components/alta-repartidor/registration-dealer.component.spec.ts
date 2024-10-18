import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationDealerComponent } from './registration-dealer.component';

describe('RegistrationDealerComponent', () => {
  let component: RegistrationDealerComponent;
  let fixture: ComponentFixture<RegistrationDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationDealerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrationDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
