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
  GetUsersByCouncil(): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/users?filter=council`)
  }
  GetUserListByRole(role:string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/users?role=${role}`)
  }
  GetUserById(userId: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/users/${userId}`)
  }
  AddUser(user: any): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/users`, user)
  }
  UpdateUser(user: any): Observable<any> {
    return this.httpClient.put(`${environments.baseUrl}/users`, user)
  }
  DeleteUser(userId: string): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/users/${userId}`)
  }
}
