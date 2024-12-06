import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private http = inject(HttpClient);

  public getCountries(): Observable<string[]> {
    return this.http.get<string[]>('/api/countries.json');
  }

  public getDepartments(): Observable<string[]> {
    return this.http.get<string[]>('/api/departments.json');
  }

  public getCitiesByDepartment(deparment: string): Observable<string[]> {
    return this.http.get<string[]>(`/api/${deparment}.json`);
  }
}
