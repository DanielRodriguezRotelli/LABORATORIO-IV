import { ValidatorFn, ValidationErrors, AbstractControl } from "@angular/forms";

export function passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        
      const password = formGroup.get('password');
      const confirmPassword = formGroup.get('confirmPassword');
      const respuestaError = { noCoincide: 'Las contraseñas no coinciden' };

      if (password?.value !== confirmPassword?.value) {
        formGroup.get('confirmPassword')?.setErrors(respuestaError);
        // Si los campos de contraseña no coinciden, devolvemos un error de validación
        return respuestaError;

      } else {
        formGroup.get('confirmPassword')?.setErrors(null);
        // Si los campos de contraseña coinciden, la validación es correcta
        return null;
      }
    };
  }