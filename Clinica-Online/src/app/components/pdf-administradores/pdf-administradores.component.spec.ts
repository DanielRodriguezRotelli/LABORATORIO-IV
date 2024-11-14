import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfAdministradoresComponent } from './pdf-administradores.component';

describe('PdfAdministradoresComponent', () => {
  let component: PdfAdministradoresComponent;
  let fixture: ComponentFixture<PdfAdministradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfAdministradoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdfAdministradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
