import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIcecreamComponent } from './create-icecream.component';

describe('CreateIcecreamComponent', () => {
  let component: CreateIcecreamComponent;
  let fixture: ComponentFixture<CreateIcecreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateIcecreamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateIcecreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
