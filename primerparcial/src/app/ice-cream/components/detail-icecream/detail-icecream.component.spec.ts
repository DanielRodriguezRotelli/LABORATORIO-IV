import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailIcecreamComponent } from './detail-icecream.component';

describe('DetailIcecreamComponent', () => {
  let component: DetailIcecreamComponent;
  let fixture: ComponentFixture<DetailIcecreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailIcecreamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailIcecreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
