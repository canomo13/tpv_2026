import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'WAITER' | 'WAREHOUSE' | 'KITCHEN';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadSession();
  }

  private loadSession() {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUser.set(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => this.setSession(res))
    );
  }

  loginPin(pin: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login-pin`, { pin }).pipe(
      tap(res => this.setSession(res))
    );
  }

  private setSession(authResult: any) {
    localStorage.setItem('access_token', authResult.access_token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    this.currentUser.set(authResult.user);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.role === role;
  }

  getToken() {
    return localStorage.getItem('access_token');
  }
}
