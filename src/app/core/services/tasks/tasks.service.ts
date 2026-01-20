import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../shared/environments';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private httpClient: HttpClient) { }
  GetUserList(pageIndex: number): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/tasks?pageIndex=${pageIndex}&pageSize=2`)
  }
}
