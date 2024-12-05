import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryDriverComponent } from './country-driver.component';

describe('CountryDriverComponent', () => {
  let component: CountryDriverComponent;
  let fixture: ComponentFixture<CountryDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryDriverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CountryDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
