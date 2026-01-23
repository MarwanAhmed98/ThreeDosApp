import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../shared/environments';

@Injectable({
  providedIn: 'root'
})
export class TaskSubmissionsService {

  constructor(private httpClient: HttpClient) { }

  GetSubmissionList(pageIndex: number, pageSize: number = 10, taskId: string = ''): Observable<any> {
    let url = `${environments.baseUrl}/task-submissions?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    if (taskId) {
      url += `&taskId=${taskId}`;
    }
    return this.httpClient.get(url)
  }
  GetSubmissionByTaskId(taskId: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/task-submissions/task/${taskId}`)
  }
  GetSubmissionById(submissionId: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/task-submissions/${submissionId}`)
  }

  AddSubmission(taskId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('task_id', taskId);
    formData.append('file', file);
    return this.httpClient.post(`${environments.baseUrl}/task-submissions`, formData)
  }

  UpdateSubmission(submissionId: string, submission: any): Observable<any> {
    return this.httpClient.put(`${environments.baseUrl}/task-submissions/${submissionId}`, submission)
  }

  DeleteSubmission(submissionId: string): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/task-submissions/${submissionId}`)
  }
}
