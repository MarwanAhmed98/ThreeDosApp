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
}
