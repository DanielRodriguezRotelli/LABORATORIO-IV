import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfPacientesComponent } from './pdf-pacientes.component';

describe('PdfPacientesComponent', () => {
  let component: PdfPacientesComponent;
  let fixture: ComponentFixture<PdfPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfPacientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdfPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
