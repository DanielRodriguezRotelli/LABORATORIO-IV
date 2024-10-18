import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedDealerComponent } from './selected-dealer.component';

describe('SelectedDealerComponent', () => {
  let component: SelectedDealerComponent;
  let fixture: ComponentFixture<SelectedDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedDealerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectedDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
