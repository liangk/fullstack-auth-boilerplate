import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest, UserProfile } from '../models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private _isAuthenticated$ = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticated$.asObservable();

  private base = environment.apiUrl + '/auth';

  login(data: LoginRequest): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.base}/login`, data, { withCredentials: true }).pipe(
      tap(() => this._isAuthenticated$.next(true))
    );
  }

  register(data: RegisterRequest): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.base}/register`, data, { withCredentials: true }).pipe(
      tap(() => this._isAuthenticated$.next(true))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.base}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this._isAuthenticated$.next(false))
    );
  }

  profile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.base}/profile`, { withCredentials: true });
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
