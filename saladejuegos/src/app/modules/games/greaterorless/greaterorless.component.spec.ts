import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreaterorlessComponent } from './greaterorless.component';

describe('GreaterorlessComponent', () => {
  let component: GreaterorlessComponent;
  let fixture: ComponentFixture<GreaterorlessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreaterorlessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GreaterorlessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
