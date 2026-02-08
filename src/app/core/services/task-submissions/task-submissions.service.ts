// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { environments } from '../../../shared/environments';

// @Injectable({
//   providedIn: 'root'
// })
// export class TaskSubmissionsService {

//   constructor(private httpClient: HttpClient) { }

//   GetSubmissionList(pageIndex: number, pageSize: number = 10, taskId: string = ''): Observable<any> {
//     let url = `${environments.baseUrl}/task-submissions?pageIndex=${pageIndex}&pageSize=${pageSize}`;
//     if (taskId) {
//       url += `&task_id=${taskId}`;
//     }
//     return this.httpClient.get(url);
//   }

//   GetSubmissionByTaskId(taskId: string, pageIndex: number, pageSize: number = 10): Observable<any> {
//     return this.httpClient.get(`${environments.baseUrl}/task-submissions?pageIndex=${pageIndex}&pageSize=${pageSize}&task_id=${taskId}`);
//   }

//   GetSubmissionById(submissionId: string): Observable<any> {
//     return this.httpClient.get(`${environments.baseUrl}/task-submissions/${submissionId}`);
//   }

//   AddSubmission(taskId: string, file: File): Observable<any> {
//     const formData = new FormData();
//     formData.append('task_id', taskId);
//     formData.append('file', file, file.name);

//     return this.httpClient.post(`${environments.baseUrl}/task-submissions`, formData);
//   }

//   AddSubmissionWithUrl(submissionData: any): Observable<any> {
//     // Create FormData to properly handle the submission
//     const formData = new FormData();
//     formData.append('task_id', submissionData.task_id);

//     // Create a blob from the URL to simulate a file
//     const blob = new Blob([submissionData.file], { type: 'text/plain' });
//     const file = new File([blob], `google-drive-link-${submissionData.file_id}.txt`, { type: 'text/plain' });

//     formData.append('file', file);

//     // Add other fields if they exist
//     if (submissionData.comment) {
//       formData.append('comment', submissionData.comment);
//     }
//     if (submissionData.file_id) {
//       formData.append('file_id', submissionData.file_id);
//     }
//     if (submissionData.file_type) {
//       formData.append('file_type', submissionData.file_type);
//     }

//     return this.httpClient.post(`${environments.baseUrl}/task-submissions`, formData);
//   }

//   UpdateSubmission(submissionId: string, submission: any): Observable<any> {
//     return this.httpClient.put(`${environments.baseUrl}/task-submissions/${submissionId}`, submission);
//   }

//   DeleteSubmission(submissionId: string): Observable<any> {
//     return this.httpClient.delete(`${environments.baseUrl}/task-submissions/${submissionId}`);
//   }
// }


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
      url += `&task_id=${taskId}`;
    }
    return this.httpClient.get(url);
  }

  GetSubmissionByTaskId(taskId: string, pageIndex: number, pageSize: number = 10): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/task-submissions?pageIndex=${pageIndex}&pageSize=${pageSize}&task_id=${taskId}`);
  }

  GetSubmissionById(submissionId: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/task-submissions/${submissionId}`);
  }

  AddSubmission(taskId: string, userId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('task_id', taskId);
    formData.append('user_id', userId);
    formData.append('file', file, file.name);

    return this.httpClient.post(`${environments.baseUrl}/task-submissions`, formData);
  }

  AddSubmissionWithUrl(submissionData: any): Observable<any> {
    const formData = new FormData();
    formData.append('task_id', submissionData.task_id);

    // FIX: Add the user_id here so the backend knows which student this is for
    formData.append('user_id', submissionData.user_id);

    // FIX: Append the URL string directly.
    // Do NOT wrap it in new Blob() or new File().
    formData.append('file', submissionData.file);

    // Add other fields if they exist
    if (submissionData.comment) {
      formData.append('comment', submissionData.comment);
    }
    if (submissionData.file_id) {
      formData.append('file_id', submissionData.file_id);
    }
    if (submissionData.file_type) {
      formData.append('file_type', submissionData.file_type);
    }

    return this.httpClient.post(`${environments.baseUrl}/task-submissions`, formData);
  }

  UpdateSubmission(submissionId: string, submission: any): Observable<any> {
    return this.httpClient.put(`${environments.baseUrl}/task-submissions/${submissionId}`, submission);
  }

  DeleteSubmission(submissionId: string): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/task-submissions/${submissionId}`);
  }
  GetAssignmentsByUserId(userId: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/task-submissions?pageIndex=1&pageSize=10&user_id=${userId}`);
  }
}