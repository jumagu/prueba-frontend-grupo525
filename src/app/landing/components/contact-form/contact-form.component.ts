import { Component, inject, OnInit, signal } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { of, switchMap, tap } from 'rxjs';

import { IUser } from '@/users/interfaces/user.interface';
import { UsersService } from '@/users/services/users.service';
import { calculateYearsInRange } from '@/shared/utils/date-utils';
import { ContactService } from '@/landing/services/contact.service';
import CustomInputComponent from '@/shared/components/custom-input/custom-input.component';
import CustomSelectComponent from '@/shared/components/custom-select/custom-select.component';
import CustomTextareaComponent from '@/shared/components/custom-textarea/custom-textarea.component';

@Component({
  selector: 'landing-contact-form',
  imports: [
    ReactiveFormsModule,
    CustomInputComponent,
    CustomSelectComponent,
    CustomTextareaComponent,
  ],
  templateUrl: './contact-form.component.html',
})
export default class ContactFormComponent implements OnInit {
  public readonly SEXES = ['Hombre', 'Mujer'];

  public availableCountries = signal<string[]>([]);
  public availableDepartments = signal<string[]>([]);
  public cities = signal<string[]>([]);

  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private usersService = inject(UsersService);
  private contactService = inject(ContactService);

  contactForm = this.formBuilder.group({
    sex: ['', Validators.required],
    birthDate: ['', Validators.required],
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    house: [''],
    country: ['', Validators.required],
    department: ['', Validators.required],
    city: ['', Validators.required],
    comment: [
      '',
      [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(150),
      ],
    ],
  });

  ngOnInit(): void {
    this.getCountries();
    this.getDepartments();
    this.onCountryChange();
    this.onDepartmentChange();
    this.setUserToEditValues();
  }

  public onSubmit(): void {
    if (this.contactForm.invalid) return this.contactForm.markAllAsTouched();
    const birthDate = new Date(this.contactForm.controls.birthDate.value!);
    const age = calculateYearsInRange(birthDate, new Date());
    if (age < 0 || age > 100) {
      Swal.fire(
        'Edad inválida',
        'Por favor ingrese una edad válida.',
        'warning'
      );
      return;
    }
    if (age < 18) {
      Swal.fire(
        'Edad mínima requerida.',
        'Tiene que ser mayor de edad para poder registrase.',
        'info'
      );
      return;
    }
    if (this.usersService.currentUser()) {
      const userId = this.usersService.currentUser()?.id!;
      this.usersService.updateUser(userId, this.contactForm.value as IUser);
    } else {
      this.usersService.addUser(this.contactForm.value as IUser);
    }
    this.router.navigateByUrl('/users');
  }

  private getCountries(): void {
    this.contactService.getCountries().subscribe(this.availableCountries.set);
  }

  private getDepartments(): void {
    this.contactService
      .getDepartments()
      .subscribe(this.availableDepartments.set);
  }

  private onCountryChange(): void {
    this.contactForm.controls.country.valueChanges
      .pipe(
        tap((country) => {
          if (country === 'Colombia') {
            this.contactForm.controls.department.enable();
          } else {
            this.contactForm.controls.department.disable();
            this.contactForm.controls.city.disable();
          }
        }),
        tap(() => this.contactForm.controls.department.reset('')),
        tap(() => this.contactForm.controls.city.reset(''))
      )
      .subscribe();
  }

  private onDepartmentChange(): void {
    this.contactForm.controls.department.valueChanges
      .pipe(
        tap(() => this.cities.set([])),
        tap(() => this.contactForm.controls.city.reset('')),
        switchMap((department) => {
          if (department && department.length > 0) {
            this.contactForm.controls.city.enable();
            return this.contactService.getCitiesByDepartment(
              department.toLowerCase()
            );
          } else {
            return of([]);
          }
        })
      )
      .subscribe(this.cities.set);
  }

  private setUserToEditValues(): void {
    const currentUser = this.usersService.currentUser();
    if (currentUser) {
      const { id, ...rest } = currentUser;
      this.contactForm.setValue({
        ...rest,
        house: currentUser.house ?? '',
      });
    }
  }
}
