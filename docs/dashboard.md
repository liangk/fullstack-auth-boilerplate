# Dashboard Guide

Complete guide to the admin dashboard functionality in the StackInsight Auth Lite.

## Overview

The dashboard provides administrators with comprehensive insights into user registrations, activity, and system statistics. It's built with Angular Material and fetches real-time data from the backend API.

## Features

### 📊 Statistics Cards

Four primary metric cards displaying key information:

1. **Total Users**
   - Total registered users
   - Breakdown: Verified vs Unverified
   - Color-coded chips for status

2. **New Users Today**
   - Count of registrations today
   - Additional info: Weekly count

3. **New This Month**
   - Monthly registration count
   - Growth tracking

4. **Verification Rate**
   - Percentage of verified users
   - Visual progress bar

### 📈 User Activity

Tracks user engagement:

- **Active Last 24h**: Users with recent activity
- **Active Last 7 days**: Weekly active users

**Note**: "Active" is determined by the `updatedAt` timestamp (logins, profile updates, etc.)

### 📉 User Growth

30-day growth visualization:

- Total new users in period
- Average daily registrations
- Date-by-date breakdown available via API

### 👥 Recent Users Table

Interactive table showing latest registrations:

**Columns**:
- **Email**: User email address
- **Name**: User's name (or "N/A")
- **Status**: Verification badge (verified/pending)
- **Joined**: Smart date formatting

**Features**:
- Pagination support
- Total user count
- Responsive design
- Tooltip with full timestamp

## Accessing the Dashboard

### Prerequisites

- Must be logged in
- Protected by AuthGuard
- Requires valid authentication

### URL

```
http://localhost:4205/dashboard
```

Production:
```
https://your-app.vercel.app/dashboard
```

## Dashboard API Endpoints

### 1. Get Statistics

**Endpoint**: `GET /api/dashboard/stats`

**Response**:
```json
{
  "totalUsers": 150,
  "verifiedUsers": 120,
  "unverifiedUsers": 30,
  "newUsersToday": 5,
  "newUsersWeek": 25,
  "newUsersMonth": 80,
  "verificationRate": 80
}
```

### 2. Get Recent Users

**Endpoint**: `GET /api/dashboard/users/recent?limit=10&offset=0`

**Parameters**:
- `limit` (optional): Number of users to return (default: 10)
- `offset` (optional): Pagination offset (default: 0)

**Response**:
```json
{
  "users": [
    {
      "id": "uuid-string",
      "email": "user@example.com",
      "name": "John Doe",
      "emailVerified": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    }
  ],
  "total": 150,
  "limit": 10,
  "offset": 0
}
```

### 3. Get User Growth

**Endpoint**: `GET /api/dashboard/users/growth?days=30`

**Parameters**:
- `days` (optional): Number of days to retrieve (default: 30)

**Response**:
```json
[
  {
    "date": "2024-01-01",
    "count": 5
  },
  {
    "date": "2024-01-02",
    "count": 8
  }
]
```

### 4. Get User Activity

**Endpoint**: `GET /api/dashboard/users/activity`

**Response**:
```json
{
  "activeLastDay": 45,
  "activeLastWeek": 120
}
```

## Implementation Details

### Frontend Service

**File**: `frontend/src/app/services/dashboard.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private base = environment.apiUrl + '/dashboard';

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(
      `${this.base}/stats`, 
      { withCredentials: true }
    );
  }

  getRecentUsers(limit = 10, offset = 0): Observable<RecentUsersResponse> {
    return this.http.get<RecentUsersResponse>(
      `${this.base}/users/recent?limit=${limit}&offset=${offset}`, 
      { withCredentials: true }
    );
  }

  getUserGrowth(days = 30): Observable<UserGrowthData[]> {
    return this.http.get<UserGrowthData[]>(
      `${this.base}/users/growth?days=${days}`, 
      { withCredentials: true }
    );
  }

  getUserActivity(): Observable<UserActivity> {
    return this.http.get<UserActivity>(
      `${this.base}/users/activity`, 
      { withCredentials: true }
    );
  }
}
```

### Backend Controller

**File**: `backend/src/controllers/dashboardController.ts`

Key functions:
- `getDashboardStats()`: Aggregate user statistics
- `getRecentUsers()`: Paginated user list
- `getUserGrowth()`: Time-series data
- `getUserActivity()`: Activity metrics

### Data Models

**File**: `frontend/src/app/models/dashboard.ts`

```typescript
export interface DashboardStats {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  newUsersToday: number;
  newUsersWeek: number;
  newUsersMonth: number;
  verificationRate: number;
}

export interface RecentUser {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecentUsersResponse {
  users: RecentUser[];
  total: number;
  limit: number;
  offset: number;
}

export interface UserGrowthData {
  date: string;
  count: number;
}

export interface UserActivity {
  activeLastDay: number;
  activeLastWeek: number;
}
```

## UI Components

### Statistics Card

```scss
.stat-card {
  mat-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .stat-label {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
    
    mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
  }
  
  mat-card-content {
    .stat-value {
      font-size: 32px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .stat-detail {
      display: flex;
      gap: 8px;
      font-size: 13px;
      color: #888;
    }
  }
}
```

### Status Chips

**Verified User**:
```html
<mat-chip class="verified-chip">
  <mat-icon>check_circle</mat-icon>
  Verified
</mat-chip>
```

**Pending User**:
```html
<mat-chip class="pending-chip">
  <mat-icon>pending</mat-icon>
  Pending
</mat-chip>
```

### Users Table

```html
<table mat-table [dataSource]="recentUsers">
  <ng-container matColumnDef="email">
    <th mat-header-cell *matHeaderCellDef>Email</th>
    <td mat-cell *matCellDef="let user">{{ user.email }}</td>
  </ng-container>
  
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef>Name</th>
    <td mat-cell *matCellDef="let user">{{ user.name || 'N/A' }}</td>
  </ng-container>
  
  <ng-container matColumnDef="status">
    <th mat-header-cell *matHeaderCellDef>Status</th>
    <td mat-cell *matCellDef="let user">
      <mat-chip [class]="user.emailVerified ? 'verified-chip' : 'pending-chip'">
        {{ user.emailVerified ? 'Verified' : 'Pending' }}
      </mat-chip>
    </td>
  </ng-container>
  
  <ng-container matColumnDef="createdAt">
    <th mat-header-cell *matHeaderCellDef>Joined</th>
    <td mat-cell *matCellDef="let user">
      {{ formatDate(user.createdAt) }}
    </td>
  </ng-container>
  
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
```

## Date Formatting

The dashboard uses smart date formatting:

```typescript
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
```

**Examples**:
- "Just now" - Less than 1 minute
- "5m ago" - 5 minutes ago
- "3h ago" - 3 hours ago
- "2d ago" - 2 days ago
- "01/15/2024" - More than 7 days

## Loading States

The dashboard implements loading states for better UX:

```typescript
loading = true;

ngOnInit(): void {
  this.loadDashboardData();
}

loadDashboardData(): void {
  this.loading = true;
  this.dashboardService.getStats().subscribe({
    next: (data) => {
      this.stats = data;
      this.loading = false;
    },
    error: (err) => {
      this.error = 'Failed to load dashboard';
      this.loading = false;
    }
  });
}
```

**Loading UI**:
```html
@if (loading) {
  <div class="loading">
    <mat-spinner diameter="50"></mat-spinner>
  </div>
}
```

## Error Handling

Graceful error handling with user feedback:

```html
@if (error) {
  <mat-card class="error-card">
    <mat-card-content>
      <mat-icon color="warn">error</mat-icon>
      <p>{{ error }}</p>
    </mat-card-content>
  </mat-card>
}
```

## Customization

### Add New Statistics

1. **Update Backend Controller**:
```typescript
// backend/src/controllers/dashboardController.ts
export const getCustomStat = async (req: Request, res: Response) => {
  const customData = await prisma.user.count({
    where: { /* your condition */ }
  });
  res.json({ customData });
};
```

2. **Add Route**:
```typescript
// backend/src/routes/dashboardRoutes.ts
router.get('/custom-stat', getCustomStat);
```

3. **Update Frontend Model**:
```typescript
// frontend/src/app/models/dashboard.ts
export interface DashboardStats {
  // ... existing fields
  customData: number;
}
```

4. **Update Service**:
```typescript
// frontend/src/app/services/dashboard.service.ts
getCustomStat(): Observable<any> {
  return this.http.get(`${this.base}/custom-stat`, { withCredentials: true });
}
```

5. **Display in Dashboard**:
```html
<mat-card class="stat-card">
  <mat-card-header>
    <mat-icon color="primary">new_icon</mat-icon>
    <span class="stat-label">Custom Metric</span>
  </mat-card-header>
  <mat-card-content>
    <div class="stat-value">{{ stats.customData }}</div>
  </mat-card-content>
</mat-card>
```

### Add Pagination to Users Table

```typescript
pageSize = 10;
pageIndex = 0;

onPageChange(event: any): void {
  this.pageSize = event.pageSize;
  this.pageIndex = event.pageIndex;
  this.loadUsers();
}

loadUsers(): void {
  const offset = this.pageIndex * this.pageSize;
  this.dashboardService.getRecentUsers(this.pageSize, offset).subscribe({
    next: (data) => {
      this.recentUsers = data.users;
      this.totalUsers = data.total;
    }
  });
}
```

```html
<mat-paginator 
  [length]="totalUsers"
  [pageSize]="pageSize"
  [pageSizeOptions]="[5, 10, 25, 50]"
  (page)="onPageChange($event)">
</mat-paginator>
```

## Performance Considerations

### Caching

Consider implementing caching for dashboard data:

```typescript
private cache = new Map<string, { data: any, timestamp: number }>();
private CACHE_TTL = 60000; // 1 minute

getStats(): Observable<DashboardStats> {
  const cached = this.cache.get('stats');
  if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
    return of(cached.data);
  }
  
  return this.http.get<DashboardStats>(`${this.base}/stats`, { withCredentials: true })
    .pipe(
      tap(data => {
        this.cache.set('stats', { data, timestamp: Date.now() });
      })
    );
}
```

### Database Optimization

For large datasets, consider:

1. **Indexes**: Already implemented on `email` field
2. **Aggregation**: Use database aggregation functions
3. **Pagination**: Implemented for user lists
4. **Date Ranges**: Limit growth data queries

## Security

Dashboard endpoints are protected:

```typescript
// All dashboard routes require authentication
router.use(requireAuth);
```

The `requireAuth` middleware verifies JWT tokens from cookies.

## Testing Dashboard

### Manual Testing

1. Register multiple users
2. Verify some users, leave others unverified
3. Access dashboard at `/dashboard`
4. Verify all statistics are accurate
5. Check table pagination
6. Test error states (disconnect backend)

### API Testing

```bash
# Get stats (requires auth cookie)
curl -X GET http://localhost:4005/api/dashboard/stats \
  -b cookies.txt

# Get recent users
curl -X GET "http://localhost:4005/api/dashboard/users/recent?limit=5" \
  -b cookies.txt

# Get growth data
curl -X GET "http://localhost:4005/api/dashboard/users/growth?days=7" \
  -b cookies.txt
```

## Future Enhancements

Potential improvements:

- 📊 **Charts**: Add visual charts (Chart.js, ng2-charts)
- 📅 **Date Filters**: Custom date range selection
- 🔍 **Search**: Search users by email/name
- 📤 **Export**: CSV/PDF export functionality
- 🔄 **Real-time**: WebSocket updates
- 📱 **Mobile**: Enhanced mobile responsiveness
- 🎨 **Themes**: Dark mode support
- 📈 **Advanced Analytics**: Cohort analysis, retention rates

## Related Documentation

- [API Reference](./api-reference.md) - Complete API documentation
- [Architecture](./architecture.md) - System architecture
- [Development Guide](./development.md) - Local development
