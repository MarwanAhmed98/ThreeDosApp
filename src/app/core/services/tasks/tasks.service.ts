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
  GetTaskById(id: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/tasks/${id}`)
  }
  AddTask(task: any): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/tasks`, task)
  }
  UpdateTask(id: string, task: any): Observable<any> {
    return this.httpClient.put(`${environments.baseUrl}/tasks/${id}`, task)
  }
  DeleteTask(id: string): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/tasks/${id}`)
  }
}
