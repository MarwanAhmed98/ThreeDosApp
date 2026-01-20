import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../shared/environments';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) { }
  GetUserList(pageIndex: number): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/users?pageIndex=${pageIndex}&pageSize=10`)
  }
  GetUserById(id: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/users/${id}`)
  }
  AddUser(user: any): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/users`, user)
  }
  UpdateUser(id: string, user: any): Observable<any> {
    return this.httpClient.put(`${environments.baseUrl}/users/${id}`, user)
  }
  DeleteUser(id: string): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/users/${id}`)
  }
}
