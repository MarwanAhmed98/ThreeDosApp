import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../shared/environments';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private httpClient: HttpClient) { }
  GetTaskList(pageIndex: number, pageSize: number = 10, search: string = '', filter: string = ''): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/tasks?pageIndex=${pageIndex}&pageSize=${pageSize}&search=${search}&filter=${filter}`)
  }
  GetTaskById(taskId: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/tasks/${taskId}`)
  }
  AddTask(task: any): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/tasks`, task)
  }
  UpdateTask(taskId: string, task: any): Observable<any> {
    return this.httpClient.put(`${environments.baseUrl}/tasks/${taskId}`, task)
  }
  DeleteTask(taskId: string): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/tasks/${taskId}`)
  }
}
