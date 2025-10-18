import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../material.module';
import { DashboardService } from '../services/dashboard.service';
import { DashboardStats, RecentUser, UserGrowthData, UserActivity } from '../models/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MaterialModule],
  template: `
    <div class="dashboard_content">
      <div class="title2">Admin Dashboard</div>

      @if (loading) {
        <div class="loading">
          <mat-spinner diameter="50"></mat-spinner>
        </div>
      }

      @if (error) {
        <mat-card class="error-card">
          <mat-card-content>
            <mat-icon color="warn">error</mat-icon>
            <p>{{ error }}</p>
          </mat-card-content>
        </mat-card>
      }

      @if (!loading && stats) {
        <!-- Statistics Cards -->
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-header>
              <mat-icon color="primary">group</mat-icon>
              <span class="stat-label">Total Users</span>
            </mat-card-header>
            <mat-card-content>
              <div class="stat-value">{{ stats.totalUsers }}</div>
              <div class="stat-detail">
                <mat-chip class="verified-chip">{{ stats.verifiedUsers }} verified</mat-chip>
                <mat-chip class="unverified-chip">{{ stats.unverifiedUsers }} unverified</mat-chip>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-header>
              <mat-icon color="accent">trending_up</mat-icon>
              <span class="stat-label">New Users Today</span>
            </mat-card-header>
            <mat-card-content>
              <div class="stat-value">{{ stats.newUsersToday }}</div>
              <div class="stat-detail">{{ stats.newUsersWeek }} this week</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-header>
              <mat-icon color="accent">calendar_month</mat-icon>
              <span class="stat-label">New This Month</span>
            </mat-card-header>
            <mat-card-content>
              <div class="stat-value">{{ stats.newUsersMonth }}</div>
              <div class="stat-detail">Monthly growth</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-header>
              <mat-icon color="primary">verified_user</mat-icon>
              <span class="stat-label">Verification Rate</span>
            </mat-card-header>
            <mat-card-content>
              <div class="stat-value">{{ stats.verificationRate }}%</div>
              <mat-progress-bar mode="determinate" [value]="stats.verificationRate" color="primary"></mat-progress-bar>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- User Activity -->
        @if (activity) {
          <mat-card class="activity-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>timeline</mat-icon>
                User Activity
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="activity-stats">
                <div class="activity-item">
                  <span class="activity-label">Active (Last 24h):</span>
                  <span class="activity-value">{{ activity.activeLastDay }} users</span>
                </div>
                <mat-divider></mat-divider>
                <div class="activity-item">
                  <span class="activity-label">Active (Last 7 days):</span>
                  <span class="activity-value">{{ activity.activeLastWeek }} users</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        }

        <!-- User Growth Chart Data -->
        @if (growthData.length > 0) {
          <mat-card class="growth-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>show_chart</mat-icon>
                User Growth (Last 30 Days)
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="growth-summary">
                <p>Total new users in last 30 days: <strong>{{ getTotalGrowth() }}</strong></p>
                <p>Average per day: <strong>{{ getAverageGrowth() }}</strong></p>
              </div>
            </mat-card-content>
          </mat-card>
        }

        <!-- Recent Users Table -->
        @if (recentUsers.length > 0) {
          <mat-card class="users-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>person_add</mat-icon>
                Recent Users
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <table mat-table [dataSource]="recentUsers" class="users-table">
                <!-- Email Column -->
                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>Email</th>
                  <td mat-cell *matCellDef="let user">{{ user.email }}</td>
                </ng-container>

                <!-- Name Column -->
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let user">{{ user.name || 'N/A' }}</td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let user">
                    @if (user.emailVerified) {
                      <mat-chip class="verified-chip">
                        <mat-icon>check_circle</mat-icon>
                        Verified
                      </mat-chip>
                    } @else {
                      <mat-chip class="pending-chip">
                        <mat-icon>pending</mat-icon>
                        Pending
                      </mat-chip>
                    }
                  </td>
                </ng-container>

                <!-- Created At Column -->
                <ng-container matColumnDef="createdAt">
                  <th mat-header-cell *matHeaderCellDef>Joined</th>
                  <td mat-cell *matCellDef="let user" [matTooltip]="user.createdAt">
                    {{ formatDate(user.createdAt) }}
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>

              <div class="table-footer">
                <p>Showing {{ recentUsers.length }} of {{ totalUsers }} users</p>
              </div>
            </mat-card-content>
          </mat-card>
        }
      }
    </div>
  `,
  styles: [`
    .dashboard_content { padding: 20px; max-width: 1400px; margin: 0 auto; }
    .loading { display: flex; justify-content: center; align-items: center; min-height: 400px; }
    .error-card { margin: 20px 0; background: #ffebee; mat-card-content { display: flex; align-items: center; gap: 12px; color: #c62828; } }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 24px; }
    .stat-card { mat-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; .stat-label { font-size: 14px; color: #666; font-weight: 500; } mat-icon { font-size: 28px; width: 28px; height: 28px; } } mat-card-content { .stat-value { font-size: 32px; font-weight: 600; margin-bottom: 8px; } .stat-detail { display: flex; gap: 8px; flex-wrap: wrap; font-size: 13px; color: #888; margin-top: 8px; } } }
    .verified-chip { background-color: #e8f5e9 !important; color: #2e7d32 !important; font-size: 11px; height: 24px; mat-icon { font-size: 16px; width: 16px; height: 16px; } }
    .unverified-chip { background-color: #fff3e0 !important; color: #f57c00 !important; font-size: 11px; height: 24px; }
    .pending-chip { background-color: #fff3e0 !important; color: #f57c00 !important; font-size: 12px; mat-icon { font-size: 16px; width: 16px; height: 16px; margin-right: 4px; } }
    .activity-card, .growth-card, .users-card { margin-bottom: 24px; mat-card-header { margin-bottom: 16px; mat-card-title { display: flex; align-items: center; gap: 12px; font-size: 18px; font-weight: 600; mat-icon { color: #1976d2; } } } }
    .activity-stats { .activity-item { display: flex; justify-content: space-between; padding: 12px 0; .activity-label { color: #666; } .activity-value { font-weight: 600; color: #1976d2; } } mat-divider { margin: 8px 0; } }
    .growth-summary { p { margin: 8px 0; color: #666; strong { color: #1976d2; } } }
    .users-table { width: 100%; th { font-weight: 600; color: #666; } td, th { padding: 12px 8px; } }
    .table-footer { margin-top: 16px; padding-top: 16px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 14px; }
  `],
  styleUrl: './pages.scss'
})
export class DashboardPage implements OnInit {
  private dashboardService = inject(DashboardService);

  stats: DashboardStats | null = null;
  recentUsers: RecentUser[] = [];
  growthData: UserGrowthData[] = [];
  activity: UserActivity | null = null;
  totalUsers = 0;
  loading = true;
  error = '';

  displayedColumns: string[] = ['email', 'name', 'status', 'createdAt'];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = '';

    // Load all dashboard data
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard statistics';
        this.loading = false;
        console.error(err);
      }
    });

    this.dashboardService.getRecentUsers(10).subscribe({
      next: (data) => {
        this.recentUsers = data.users;
        this.totalUsers = data.total;
      },
      error: (err) => console.error('Failed to load recent users:', err)
    });

    this.dashboardService.getUserGrowth(30).subscribe({
      next: (data) => {
        this.growthData = data;
      },
      error: (err) => console.error('Failed to load growth data:', err)
    });

    this.dashboardService.getUserActivity().subscribe({
      next: (data) => {
        this.activity = data;
      },
      error: (err) => console.error('Failed to load activity data:', err)
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }

  getTotalGrowth(): number {
    return this.growthData.reduce((sum, day) => sum + day.count, 0);
  }

  getAverageGrowth(): string {
    const total = this.getTotalGrowth();
    const avg = this.growthData.length > 0 ? total / this.growthData.length : 0;
    return avg.toFixed(1);
  }
}
