export interface IUsersResponse {
  users: IServiceUser[];
}

export interface IServiceUser {
  id: number;
  sex: string;
  date_birthday: string;
  name: string;
  last_name: string;
  email: string;
  addres: string;
  country: string;
  Deparment: string;
  City: string;
  comment: string;
}

export interface IUser {
  id?: number;
  sex: string;
  birthDate: string;
  name: string;
  lastName: string;
  email: string;
  address: string;
  house?: string;
  country: string;
  department: string;
  city: string;
  comment: string;
}
