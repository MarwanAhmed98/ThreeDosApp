import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  SendLoginForm(data: object): Observable<any> {
    return this.httpClient.post('https://threedos-apis-production.up.railway.app/api/login', data, {
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
