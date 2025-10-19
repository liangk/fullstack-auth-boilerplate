import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardStats, RecentUsersResponse, UserGrowthData, UserActivity } from '../models/dashboard';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private base = environment.apiUrl + '/dashboard';

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.base}/stats`, { withCredentials: true });
  }

  getRecentUsers(limit: number = 10, offset: number = 0): Observable<RecentUsersResponse> {
    return this.http.get<RecentUsersResponse>(`${this.base}/users/recent?limit=${limit}&offset=${offset}`, { withCredentials: true });
  }

  getUserGrowth(days: number = 30): Observable<UserGrowthData[]> {
    return this.http.get<UserGrowthData[]>(`${this.base}/users/growth?days=${days}`, { withCredentials: true });
  }

  getUserActivity(): Observable<UserActivity> {
    return this.http.get<UserActivity>(`${this.base}/users/activity`, { withCredentials: true });
  }
}
