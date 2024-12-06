import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { IUser } from '@/users/interfaces/user.interface';
import { UsersService } from '@/users/services/users.service';
import CustomTableComponent from '@/shared/components/custom-table/custom-table.component';

@Component({
  selector: 'admin-user-table',
  imports: [CustomTableComponent],
  templateUrl: './user-table.component.html',
})
export default class UserTableComponent {
  public readonly COLUMN_HEADERS = [
    {
      id: 'id',
      title: 'ID',
    },
    {
      id: 'sex',
      title: 'Sexo',
    },
    {
      id: 'birthDate',
      title: 'Fecha de nacimiento',
    },
    {
      id: 'name',
      title: 'Nombre',
    },
    {
      id: 'lastName',
      title: 'Apellido',
    },
    {
      id: 'email',
      title: 'Email',
    },
    {
      id: 'address',
      title: 'Dirección',
    },
    {
      id: 'house',
      title: 'Casa / Apartamento',
    },
    {
      id: 'country',
      title: 'País',
    },
    {
      id: 'deparment',
      title: 'Departamento',
    },
    {
      id: 'city',
      title: 'Ciudad',
    },
    {
      id: 'comment',
      title: 'Comentarios',
    },
  ];

  public users = computed(() => this.usersService.users());

  private router = inject(Router);
  private usersService = inject(UsersService);

  public onEditUser(user: IUser): void {
    this.usersService.setCurrentUser(user);
    this.router.navigateByUrl('/contact');
  }
}
