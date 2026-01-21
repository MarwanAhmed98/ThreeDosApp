import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../shared/environments';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private httpClient: HttpClient) { }

  GetRolesList(): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/roles`)
  }

  AddRole(role: string): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/roles`,
      {
        "name": role
      }
    )
  }

  GetRoleById(roleId: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/roles/${roleId}`)
  }

  UpdateRole(roleId: string, role: string): Observable<any> {
    return this.httpClient.put(`${environments.baseUrl}/roles/${roleId}`,
      {
        "name": role
      }
    )
  }

  DeleteRole(roleId: string): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/roles/${roleId}`)
  }
}
