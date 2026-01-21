import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../shared/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  SendLoginForm(data: object): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/login`, data)
  }
  Logout(): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/logout`, {})
  }
  GetMe(): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/me`)
  }
  ForgetPassword(email: string): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/forget-password`, { email })
  }
  GetInstance(): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/instance`)
  }
}
