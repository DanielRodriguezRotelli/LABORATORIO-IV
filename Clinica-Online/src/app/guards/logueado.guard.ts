import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const logueadoGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
    const authService = inject(AuthService);
  console.log(authService.tipoUsuario)
    if (authService.tipoUsuario != "")
      {
        return true;
      }
      else
      {
        router.navigateByUrl('bienvenida');
        return false;
      }
    
  };
  