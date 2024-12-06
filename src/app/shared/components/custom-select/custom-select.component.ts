import { Component, forwardRef, input } from '@angular/core';

import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import ValidationErrorComponent from '../field-validation-error/validation-error.component';
import ControlValueAccessorDirective from '@/shared/directives/control-value-accessor.directive';

@Component({
  selector: 'shared-custom-select',
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
    },
  ],
  imports: [ReactiveFormsModule, ValidationErrorComponent],
  styleUrl: './custom-select.component.css',
  templateUrl: './custom-select.component.html',
})
export default class CustomSelectComponent<
  T
> extends ControlValueAccessorDirective<T> {
  public selectId = input();
  public label = input();
  public options = input.required<T[]>();
  public placeholder = input<string>();
}
