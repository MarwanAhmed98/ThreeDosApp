import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../shared/environments';

@Injectable({
  providedIn: 'root'
})
export class AttendancesService {

  constructor(private httpClient: HttpClient) { }

  GetAttendanceList(pageIndex: number, pageSize: number = 10): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/attendances?pageIndex=${pageIndex}&pageSize=${pageSize}`)
  }

  GetAttendanceById(attendanceId: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/attendances/${attendanceId}`)
  }

  AddAttendance(attendance: any): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/attendances`, attendance)
  }

  BulkCreateAttendance(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(`${environments.baseUrl}/attendances/bulk`, formData)
  }

  UpdateAttendance(attendanceId: string, attendance: any): Observable<any> {
    return this.httpClient.put(`${environments.baseUrl}/attendances/${attendanceId}`, attendance)
  }

  DeleteAttendance(attendanceId: string): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/attendances/${attendanceId}`)
  }
}
