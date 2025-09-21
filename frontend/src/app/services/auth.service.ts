import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest, UserProfile, RegisterResponse } from '../models/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private _isAuthenticated$ = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticated$.asObservable();

  private router = inject(Router);
  private base = environment.apiUrl + '/auth';

  login(data: LoginRequest): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.base}/login`, data, { withCredentials: true }).pipe(
      tap(() => this._isAuthenticated$.next(true))
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.base}/register`, data, { withCredentials: true });
  }

  logout(): void {
    this.http.post<void>(`${this.base}/logout`, {}, { withCredentials: true }).subscribe(() => {
      this._isAuthenticated$.next(false);
      this.router.navigateByUrl('/login');
    });
  }

  profile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.base}/profile`, { withCredentials: true });
  }

  resendVerification(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/resend-verification`, { email }, { withCredentials: true });
  }

  verifyEmail(token: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.base}/verify-email?token=${encodeURIComponent(token)}`, { withCredentials: true });
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/forgot-password`, { email }, { withCredentials: true });
  }

  resetPassword(token: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/reset-password`, { token, password }, { withCredentials: true });
  }

  refresh(): Observable<void> {
    return this.http.post<void>(`${this.base}/refresh`, {}, { withCredentials: true }).pipe(
      tap(() => this._isAuthenticated$.next(true))
    );
  }

  checkAuth(): Observable<boolean> {
    return this.profile().pipe(
      tap(() => this._isAuthenticated$.next(true)),
      map(() => true),
      catchError(() => {
        this._isAuthenticated$.next(false);
        return of(false);
      })
    );
  }
}
