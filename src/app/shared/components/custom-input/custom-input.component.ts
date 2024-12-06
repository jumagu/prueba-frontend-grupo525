import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import ValidationErrorComponent from '../field-validation-error/validation-error.component';
import ControlValueAccessorDirective from '@/shared/directives/control-value-accessor.directive';

type TInput = 'text' | 'number' | 'email' | 'password' | 'date';

@Component({
  selector: 'shared-custom-input',
  imports: [ReactiveFormsModule, ValidationErrorComponent],
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
    },
  ],
  styleUrl: './custom-input.component.css',
  templateUrl: './custom-input.component.html',
})
export default class CustomInputComponent<
  T
> extends ControlValueAccessorDirective<T> {
  public inputId = input<string>();
  public label = input<string>();
  public type = input<TInput>('text');
  public placeholder = input<string>('');
}
