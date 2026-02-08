import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../shared/environments';

export interface AiChatRequest {
  message: string;
}

export interface AiChatResponse {
  status: string;
  data?: any;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatService {

  constructor(private httpClient: HttpClient) { }

  sendMessage(message: string): Observable<AiChatResponse> {
    const payload: AiChatRequest = { message };
    return this.httpClient.post<AiChatResponse>(`${environments.baseUrl}/ai-chat`, payload);
  }
}
