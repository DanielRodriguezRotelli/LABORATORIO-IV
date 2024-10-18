import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDealerComponent } from './detail-dealer.component';

describe('DetailDealerComponent', () => {
  let component: DetailDealerComponent;
  let fixture: ComponentFixture<DetailDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailDealerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
