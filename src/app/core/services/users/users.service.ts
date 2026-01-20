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
}
