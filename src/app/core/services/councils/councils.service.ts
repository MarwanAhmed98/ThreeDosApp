import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../shared/environments';

@Injectable({
  providedIn: 'root'
})
export class CouncilsService {

  constructor(private httpClient: HttpClient) { }
  GetCouncilList(): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/councils?pageIndex=1&pageSize=10`)
  }
  GetCouncilById(id: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/councils/${id}`)
  }
  AddCouncil(council: any): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/councils`, council)
  }
  UpdateCouncil(id: string, council: any): Observable<any> {
    return this.httpClient.put(`${environments.baseUrl}/councils/${id}`, council)
  }
  DeleteCouncil(id: string): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/councils/${id}`)
  }
}
