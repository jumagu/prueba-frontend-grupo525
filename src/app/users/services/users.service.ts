import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

import { map, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { IUser, IUsersResponse } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _users = signal<IUser[]>([]);
  private _currentUser = signal<IUser | null>(null);

  public users = computed(() => this._users());
  public currentUser = computed(() => this._currentUser());

  private readonly API_URL = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {
    this.fetchUsers().subscribe((users) => this._users.set(users));
  }

  public setUsers(users: IUser[]): void {
    this._users.set(users);
  }

  public addUser(user: IUser): void {
    this._users.update((prev) => [...prev, { ...user, id: prev.length + 1 }]);
  }

  public updateUser(id: number, data: IUser): void {
    this._users.update((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...data } : u))
    );
  }

  public setCurrentUser(value: IUser | null): void {
    this._currentUser.set(value);
  }

  public fetchUsers(): Observable<IUser[]> {
    return this.http.get<IUsersResponse>(`${this.API_URL}/users.json`).pipe(
      map((res) =>
        res.users.map((user) => ({
          id: user.id,
          sex: user.sex,
          birthDate: user.date_birthday,
          name: user.name,
          lastName: user.last_name,
          email: user.email,
          address: user.addres,
          country: user.country,
          department: user.Deparment,
          city: user.City,
          comment: user.comment,
        }))
      )
    );
  }
}
