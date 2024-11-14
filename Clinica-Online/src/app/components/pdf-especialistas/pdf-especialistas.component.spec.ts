import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfEspecialistasComponent } from './pdf-especialistas.component';

describe('PdfEspecialistasComponent', () => {
  let component: PdfEspecialistasComponent;
  let fixture: ComponentFixture<PdfEspecialistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfEspecialistasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdfEspecialistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
