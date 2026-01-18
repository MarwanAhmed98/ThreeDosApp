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
    return this.httpClient.post(`${environments.baseUrl}/login`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  Logout(): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/logout`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
