import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteIcecreamComponent } from './delete-icecream.component';

describe('DeleteIcecreamComponent', () => {
  let component: DeleteIcecreamComponent;
  let fixture: ComponentFixture<DeleteIcecreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteIcecreamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteIcecreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
