import { Directive, Inject, Injector, OnInit } from '@angular/core';
import {
  NgControl,
  Validators,
  FormControl,
  FormControlName,
  FormGroupDirective,
  ControlValueAccessor,
  FormControlDirective,
} from '@angular/forms';

import { distinctUntilChanged, startWith, Subject, takeUntil, tap } from 'rxjs';

@Directive({
  selector: '[sharedControlValueAccessor]',
})
export default class ControlValueAccessorDirective<T>
  implements ControlValueAccessor, OnInit
{
  public control?: FormControl;
  public isRequired = false;

  private _isDisabled = false;
  private _destroy$ = new Subject<void>();
  private _onTouched!: () => T;

  constructor(@Inject(Injector) private injector: Injector) {}

  ngOnInit(): void {
    this.setFormControl();
    this.isRequired = this.control?.hasValidator(Validators.required) ?? false;
  }

  public setFormControl(): void {
    try {
      const formControl = this.injector.get(NgControl);

      switch (formControl.constructor) {
        case FormControlName:
          this.control = this.injector
            .get(FormGroupDirective)
            .getControl(formControl as FormControlName);
          break;
        default:
          this.control = (formControl as FormControlDirective).form;
          break;
      }
    } catch {
      this.control = new FormControl();
    }
  }

  public writeValue(value: T): void {
    if (!this.control) this.control = new FormControl(value);
    if (this.control.value === value) return;
    this.control.setValue(value);
  }

  public registerOnChange(fn: (val: T | null) => T): void {
    this.control?.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        startWith(this.control.value),
        distinctUntilChanged(),
        tap((val) => fn(val))
      )
      .subscribe();
  }

  public registerOnTouched(fn: () => T): void {
    this._onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
    // if (this.control) {
    //   isDisabled ? this.control.disable() : this.control.enable();
    // }
  }

  protected get isInvalid(): boolean {
    return !!this.control && this.control.touched && !!this.control.errors;
  }
}
