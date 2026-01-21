import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../shared/environments';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor(private httpClient: HttpClient) { }

  GetCacheStats(): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/cache/stats`)
  }

  ClearEndpointCache(): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/cache/endpoint`)
  }

  ClearResourceCache(resource: string): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/cache/resource`, { body: { resource } })
  }

  ClearUserCache(userId: string): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/cache/user/${userId}`)
  }
}
