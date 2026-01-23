import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environments } from '../../../shared/environments';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  user_name: string;
  email: string;
  role: string;
  council_id?: string;
  council_name?: string;
  access_token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('userToken');
      const userName = localStorage.getItem('UserName');
      const userRole = localStorage.getItem('UserRole');
      const councilId = localStorage.getItem('UserCouncilId');
      const councilName = localStorage.getItem('UserCouncilName');

      if (token && userName && userRole) {
        const user: User = {
          id: 0, // Will be updated when GetMe() is called
          user_name: userName,
          email: '', // Will be updated when GetMe() is called
          role: userRole,
          council_id: councilId || undefined,
          council_name: councilName || undefined,
          access_token: token
        };
        this.currentUserSubject.next(user);
      }
    }
  }

  SendLoginForm(data: object): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/login`, data).pipe(
      tap((response: any) => {
        if (response.status === 'success') {
          const user: User = {
            id: response.data.id || 0,
            user_name: response.data.user_name,
            email: response.data.email || '',
            role: response.data.role,
            council_id: response.data.council?.id,
            council_name: response.data.council?.name,
            access_token: response.data.access_token
          };

          // Store in localStorage
          localStorage.setItem('userToken', response.data.access_token);
          localStorage.setItem('UserName', response.data.user_name);
          localStorage.setItem('UserRole', response.data.role);
          if (response.data.council?.id) {
            localStorage.setItem('UserCouncilId', response.data.council.id);
          }
          if (response.data.council?.name) {
            localStorage.setItem('UserCouncilName', response.data.council.name);
          }

          // Update current user
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  Logout(): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearUserData();
      })
    );
  }

  // Force logout without API call (for token expiration)
  forceLogout(): void {
    this.clearUserData();
  }

  // Check if token is expired (if token has expiration info)
  isTokenExpired(): boolean {
    const token = localStorage.getItem('userToken');
    if (!token) return true;

    try {
      // If the token is JWT, we can decode and check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      // If token is not JWT or can't be decoded, assume it's valid
      // The server will handle validation
      return false;
    }
  }

  // Get token expiration time in seconds
  getTokenExpirationTime(): number | null {
    const token = localStorage.getItem('userToken');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp;
    } catch {
      return null;
    }
  }

  // Check if token will expire soon (within 5 minutes)
  isTokenExpiringSoon(): boolean {
    const expirationTime = this.getTokenExpirationTime();
    if (!expirationTime) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    const fiveMinutes = 5 * 60; // 5 minutes in seconds

    return (expirationTime - currentTime) <= fiveMinutes;
  }

  GetMe(): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/me`).pipe(
      tap((response: any) => {
        if (response.status === 'success') {
          const currentUser = this.currentUserSubject.value;
          if (currentUser) {
            const updatedUser: User = {
              ...currentUser,
              id: response.data.id,
              email: response.data.email
            };
            this.currentUserSubject.next(updatedUser);
          }
        }
      })
    );
  }

  ForgetPassword(email: string): Observable<any> {
    return this.httpClient.post(`${environments.baseUrl}/forget-password`, { email });
  }

  GetInstance(): Observable<any> {
    return this.httpClient.get(`${environments.baseUrl}/instance`);
  }

  // Guard helper methods
  isAuthenticated(): boolean {
    if (typeof localStorage === 'undefined') return false;
    const token = localStorage.getItem('userToken');
    return !!token;
  }

  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      // Fallback to localStorage
      const role = localStorage.getItem('UserRole');
      return role === 'Head' || role === 'Instructor' || role === 'VicePresident';
    }
    return currentUser.role === 'Head' || currentUser.role === 'Instructor' || currentUser.role === 'VicePresident';
  }

  isDelegate(): boolean {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      // Fallback to localStorage
      const role = localStorage.getItem('UserRole');
      return role !== 'Head' && role !== 'Instructor' && role !== 'VicePresident' && !!role;
    }
    return currentUser.role !== 'Head' && currentUser.role !== 'Instructor' && currentUser.role !== 'VicePresident';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      return currentUser.role;
    }
    return localStorage.getItem('UserRole');
  }

  clearUserData(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('userToken');
      localStorage.removeItem('UserName');
      localStorage.removeItem('UserRole');
      localStorage.removeItem('UserCouncilId');
      localStorage.removeItem('UserCouncilName');
    }
    this.currentUserSubject.next(null);
  }
}
