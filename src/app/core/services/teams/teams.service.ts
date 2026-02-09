// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { environments } from '../../../shared/environments';

// @Injectable({
//   providedIn: 'root'
// })
// export class TeamsService {

//   constructor(private httpClient: HttpClient) { }

//   GetTeamsList(): Observable<any> {
//     return this.httpClient.get(`${environments.baseUrl}/teams`);
//   }

//   AddTeam(team: { team_number: string, council_id: string }): Observable<any> {
//     return this.httpClient.post(`${environments.baseUrl}/teams`, team);
//   }

//   AddTeamMembers(members: any[]): Observable<any> {
//     return this.httpClient.post(`${environments.baseUrl}/team-members`, { members });
//   }

//   AddTeamMember(member: any): Observable<any> {
//     return this.httpClient.post(`${environments.baseUrl}/team-members`, member);
//   }

//   GetTeamMember(memberId: string): Observable<any> {
//     return this.httpClient.get(`${environments.baseUrl}/team-members/${memberId}`);
//   }

//   UpdateTeamMember(memberId: string, member: any): Observable<any> {
//     return this.httpClient.put(`${environments.baseUrl}/team-members/${memberId}`, member);
//   }

//   DeleteTeamMember(memberId: string): Observable<any> {
//     return this.httpClient.delete(`${environments.baseUrl}/team-members/${memberId}`);
//   }

//   GetTeamMembers(teamId: string): Observable<any> {
//     return this.httpClient.get(`${environments.baseUrl}/teams/${teamId}`);
//   }

//   DeleteTeam(teamId: string): Observable<any> {
//     return this.httpClient.delete(`${environments.baseUrl}/teams/${teamId}`);
//   }
//   GetStudentTeams(StudentId: string): Observable<any> {
//     return this.httpClient.get(`${environments.baseUrl}/teams?user_id=${StudentId}&council_id=`);
//   }
// }
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../shared/environments';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(private httpClient: HttpClient) { }

  GetTeamsList(): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/teams`);
  }

  AddTeam(team: { team_number: string, council_id: string }): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/teams`, team);
  }

  AddTeamMembers(members: any[]): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/team-members`, { members });
  }

  AddTeamMember(member: any): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/team-members`, member);
  }

  GetTeamMember(memberId: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/team-members/${memberId}`);
  }

  // Ensure this sends the payload correctly
  UpdateTeamMember(memberId: string, member: any): Observable<any> {
    // If your backend is strictly RESTful, PUT usually replaces the resource.
    // If it supports partial updates, this might need to be PATCH.
    // Assuming PUT based on standard patterns:
    return this.httpClient.put(`${environments.baseUrl}/team-members/${memberId}`, member);
  }

  DeleteTeamMember(memberId: string): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/team-members/${memberId}`);
  }

  GetTeamMembers(teamId: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/teams/${teamId}`);
  }

  DeleteTeam(teamId: string): Observable<any> {
    return this.httpClient.delete(`${environments.baseUrl}/teams/${teamId}`);
  }
  GetStudentTeams(StudentId: string): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/teams?user_id=${StudentId}&council_id=`);
  }
}