import { Injectable, Injector } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { TermsComponent } from '../components/terms/terms.component';

export interface CanDeactivateComponent {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})

export class CanDeactivateGuard implements CanDeactivate<TermsComponent> {

  constructor(private injector: Injector) {}

  canDeactivate(component: TermsComponent): Observable<boolean> | Promise<boolean> | boolean {
    // Verifica si el formulario es válido
    if (!component.formTerminos?.valid) {
      return false; // Impide la navegación
      //console.log('NO PUEDE DIRIGIRSE A NINGUNA PAGINA HASTA QUE VALIDE EL FORM');
    }
    return true; // Si el formulario está completo, permite la navegación
  }
}
