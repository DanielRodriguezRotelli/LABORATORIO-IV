import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const firebaseAuth = inject(AuthService);
  try {
    return firebaseAuth.getIsAdmin();
  } catch (error) {
    console.error('Error al verificar si es administrador:', error);
    return false;
  }
};