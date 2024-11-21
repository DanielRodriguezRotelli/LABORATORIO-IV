import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appBorderSelectionBlue]',
  standalone: true
})
export class BorderSelectionBlueDirective {

  // Agrega borde azul a un elemento cuando el mouse pasa por encima (hover) y elimina ese borde cuando el mouse sale del área del elemento
  // Usado en SOLICITAR TURNO
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseover') onMouseOver() {
    this.setBorder('4px solid blue');
  }

  @HostListener('mouseout') onMouseOut() {
    this.setBorder('');
  }

  private setBorder(value: string) {
    this.renderer.setStyle(this.el.nativeElement, 'border', value);
  }
}