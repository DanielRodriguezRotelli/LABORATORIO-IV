import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateIcecreamComponent } from './update-icecream.component';

describe('UpdateIcecreamComponent', () => {
  let component: UpdateIcecreamComponent;
  let fixture: ComponentFixture<UpdateIcecreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateIcecreamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateIcecreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
