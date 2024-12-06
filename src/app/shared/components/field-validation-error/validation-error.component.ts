import { Component, computed, input } from '@angular/core';
import type { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'shared-validation-error',
  imports: [],
  templateUrl: './validation-error.component.html',
})
export default class ValidationErrorComponent {
  public errors = input.required<ValidationErrors>({});

  public error = computed(() => this.getErrorMessage(this.errors()));

  private getErrorMessage(errors: ValidationErrors): string {
    const [errorName] = Object.keys(errors);

    switch (errorName) {
      case 'required':
        return 'Este campo es requerido';
      case 'email':
        return 'Ingrese un correo válido';
      case 'pattern':
        return 'El campo tiene un formato inválido';
      case 'minlength':
        return `Mínimo ${errors[errorName].requiredLength} caracteres`;
      case 'maxlength':
        return `Máximo ${errors[errorName].requiredLength} caracteres`;
      default:
        return 'El campo tiene errores';
    }
  }
}
