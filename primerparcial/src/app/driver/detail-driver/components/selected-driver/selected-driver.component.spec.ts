import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedDriverComponent } from './selected-driver.component';

describe('SelectedDriverComponent', () => {
  let component: SelectedDriverComponent;
  let fixture: ComponentFixture<SelectedDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedDriverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectedDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
