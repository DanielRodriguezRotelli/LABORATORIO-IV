import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIcecreamComponent } from './list-icecream.component';

describe('ListIcecreamComponent', () => {
  let component: ListIcecreamComponent;
  let fixture: ComponentFixture<ListIcecreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListIcecreamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListIcecreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
