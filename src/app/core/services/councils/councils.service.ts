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
    return this.httpClient.get(`${environments.baseUrl}/councils?pageIndex=1&pageSize=8`)
  }
  GetCouncilById(councilId: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/councils/${councilId}`)
  }
  AddCouncil(council: any): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/councils`, council)
  }
  UpdateCouncil(council: any): Observable<any> {
    return this.httpClient.put(`${environments.baseUrl}/councils/${council.id}`, council)
  }
  DeleteCouncil(councilId: string): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/councils/${councilId}`)
  }
}
