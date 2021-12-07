import { AbstractControl, ValidationErrors } from '@angular/forms';

export function PasswordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const passwordConfirm = control.get('confirmPassword');
  return password && passwordConfirm && password.value !== passwordConfirm?.value ?
   { 'passwordDifrent': true } : null;
}

