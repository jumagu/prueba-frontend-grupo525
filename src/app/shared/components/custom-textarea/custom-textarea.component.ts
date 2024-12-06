import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Component, forwardRef, input } from '@angular/core';

import ValidationErrorComponent from '../field-validation-error/validation-error.component';
import ControlValueAccessorDirective from '@/shared/directives/control-value-accessor.directive';

@Component({
  selector: 'shared-custom-textarea',
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomTextareaComponent),
    },
  ],
  imports: [ReactiveFormsModule, ValidationErrorComponent],
  styleUrl: './custom-textarea.component.css',
  templateUrl: './custom-textarea.component.html',
})
export default class CustomTextareaComponent<
  T
> extends ControlValueAccessorDirective<T> {
  public textareaId = input<string>();
  public label = input<string>();
  public placeholder = input<string>('');
}
