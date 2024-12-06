import { Component } from '@angular/core';
import UserTableComponent from '../../components/user-table/user-table.component';

@Component({
  selector: 'admin-user-page',
  imports: [UserTableComponent],
  templateUrl: './user-page.component.html',
})
export default class UserPageComponent {}
