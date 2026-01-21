import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../shared/environments';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  constructor(private httpClient: HttpClient) { }
  GetSessionlList(pagenumber: number): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/sessions?pageIndex=${pagenumber}&pageSize=5&search=`)
  }
  GetSessionById(sessionId: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/sessions/${sessionId}`)
  }
  AddSession(session: any): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/sessions`, session)
  }
  UpdateSession(session: any): Observable<any> {
    return this.httpClient.put(`${environments.baseUrl}/sessions`, session)
  }
  DeleteSession(sessionId: string): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/sessions/${sessionId}`)
  }
}
