# Dashboard API Endpoints

Complete reference for dashboard and analytics API endpoints in StackInsight Auth Lite.

## Base URL

- **Development**: `http://localhost:4005/api`
- **Production**: `https://your-domain.com/api`

## Authentication

All dashboard endpoints require authentication via access token cookie.

---

## Get Dashboard Statistics

Retrieve overall dashboard statistics and metrics.

**Endpoint:** `GET /dashboard/stats`

**Authentication:** Required

### Request

No parameters required

### Success Response

**Status:** `200 OK`

```json
{
  "totalUsers": 1234,
  "verifiedUsers": 1100,
  "unverifiedUsers": 134,
  "newUsersToday": 45,
  "newUsersThisWeek": 234,
  "newUsersThisMonth": 890,
  "activeUsers": 567,
  "totalLogins": 45678,
  "loginsToday": 234,
  "lastUpdated": "2024-01-20T10:30:00.000Z"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| totalUsers | number | Total registered users |
| verifiedUsers | number | Users with verified email |
| unverifiedUsers | number | Users pending verification |
| newUsersToday | number | Registrations in last 24 hours |
| newUsersThisWeek | number | Registrations in last 7 days |
| newUsersThisMonth | number | Registrations in last 30 days |
| activeUsers | number | Users active in last 30 days |
| totalLogins | number | Total login count |
| loginsToday | number | Logins in last 24 hours |
| lastUpdated | string | Timestamp of data |

---

## Get User Registration Trends

Retrieve user registration data over time.

**Endpoint:** `GET /dashboard/user-trends`

**Authentication:** Required

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| period | string | '30d' | Time period: '7d', '30d', '90d', '1y' |
| groupBy | string | 'day' | Group data by: 'hour', 'day', 'week', 'month' |

### Request Example

```
GET /dashboard/user-trends?period=30d&groupBy=day
```

### Success Response

**Status:** `200 OK`

```json
{
  "period": "30d",
  "groupBy": "day",
  "data": [
    {
      "date": "2024-01-01",
      "count": 45,
      "verified": 40,
      "unverified": 5
    },
    {
      "date": "2024-01-02",
      "count": 52,
      "verified": 48,
      "unverified": 4
    }
    // ... more data points
  ],
  "summary": {
    "total": 1234,
    "average": 41.1,
    "peak": 87,
    "peakDate": "2024-01-15"
  }
}
```

---

## Get Activity Log

Retrieve user activity and authentication events.

**Endpoint:** `GET /dashboard/activity`

**Authentication:** Required

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 50 | Items per page (max 100) |
| type | string | 'all' | Event type filter |
| userId | string | - | Filter by specific user |
| startDate | string | - | Filter from date (ISO 8601) |
| endDate | string | - | Filter to date (ISO 8601) |

### Event Types

- `login` - User login
- `logout` - User logout
- `register` - New registration
- `verify_email` - Email verified
- `password_reset` - Password reset
- `password_change` - Password changed
- `profile_update` - Profile updated
- `account_delete` - Account deleted

### Request Example

```
GET /dashboard/activity?page=1&limit=20&type=login&startDate=2024-01-01
```

### Success Response

**Status:** `200 OK`

```json
{
  "data": [
    {
      "id": "evt_123abc",
      "type": "login",
      "userId": "clx123abc",
      "userEmail": "user@example.com",
      "userName": "John Doe",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2024-01-20T10:30:00.000Z",
      "success": true,
      "metadata": {
        "location": "San Francisco, CA",
        "device": "Desktop"
      }
    }
    // ... more events
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "totalPages": 25,
    "hasMore": true
  }
}
```

---

## Get User List

Retrieve paginated list of users.

**Endpoint:** `GET /dashboard/users`

**Authentication:** Required (Admin role if implemented)

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page (max 100) |
| search | string | - | Search by email or name |
| verified | boolean | - | Filter by verification status |
| sortBy | string | 'createdAt' | Sort field |
| sortOrder | string | 'desc' | Sort order: 'asc', 'desc' |

### Request Example

```
GET /dashboard/users?page=1&limit=20&verified=true&sortBy=createdAt&sortOrder=desc
```

### Success Response

**Status:** `200 OK`

```json
{
  "data": [
    {
      "id": "clx123abc",
      "email": "user@example.com",
      "name": "John Doe",
      "isVerified": true,
      "createdAt": "2024-01-20T10:30:00.000Z",
      "lastLoginAt": "2024-01-25T15:45:00.000Z",
      "loginCount": 45
    }
    // ... more users
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1234,
    "totalPages": 62,
    "hasMore": true
  }
}
```

---

## Get User Details

Retrieve detailed information about a specific user.

**Endpoint:** `GET /dashboard/users/:userId`

**Authentication:** Required (Admin role if implemented)

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| userId | string | User ID |

### Success Response

**Status:** `200 OK`

```json
{
  "user": {
    "id": "clx123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "isVerified": true,
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-25T10:30:00.000Z",
    "lastLoginAt": "2024-01-25T15:45:00.000Z",
    "loginCount": 45
  },
  "stats": {
    "totalLogins": 45,
    "lastLogin": "2024-01-25T15:45:00.000Z",
    "averageSessionDuration": "45 minutes",
    "registrationDate": "2024-01-20T10:30:00.000Z",
    "accountAge": "5 days"
  },
  "recentActivity": [
    {
      "type": "login",
      "timestamp": "2024-01-25T15:45:00.000Z",
      "ipAddress": "192.168.1.100"
    },
    {
      "type": "profile_update",
      "timestamp": "2024-01-24T10:20:00.000Z",
      "ipAddress": "192.168.1.100"
    }
  ]
}
```

---

## Get Login Statistics

Retrieve detailed login statistics and patterns.

**Endpoint:** `GET /dashboard/login-stats`

**Authentication:** Required

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| period | string | '30d' | Time period: '7d', '30d', '90d' |

### Success Response

**Status:** `200 OK`

```json
{
  "period": "30d",
  "totalLogins": 12345,
  "successfulLogins": 12000,
  "failedLogins": 345,
  "uniqueUsers": 567,
  "peakHour": "14:00",
  "peakDay": "Monday",
  "averageLoginsPerDay": 411.5,
  "hourlyDistribution": [
    { "hour": 0, "count": 45 },
    { "hour": 1, "count": 23 },
    // ... 24 hours
  ],
  "dailyDistribution": [
    { "day": "Monday", "count": 2500 },
    { "day": "Tuesday", "count": 2300 },
    // ... 7 days
  ],
  "topLocations": [
    { "country": "United States", "count": 5000 },
    { "country": "United Kingdom", "count": 2000 }
  ]
}
```

---

## Export Dashboard Data

Export dashboard data in various formats.

**Endpoint:** `GET /dashboard/export`

**Authentication:** Required (Admin role if implemented)

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | Data type: 'users', 'activity', 'stats' |
| format | string | No | Export format: 'json', 'csv' (default: 'json') |
| startDate | string | No | Filter from date |
| endDate | string | No | Filter to date |

### Request Example

```
GET /dashboard/export?type=users&format=csv&startDate=2024-01-01
```

### Success Response

**Status:** `200 OK`

**Content-Type:** `application/json` or `text/csv`

Returns the requested data in specified format.

---

## Get System Health

Retrieve system health and status information.

**Endpoint:** `GET /dashboard/health`

**Authentication:** Required

### Success Response

**Status:** `200 OK`

```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "uptime": "45d 12h 30m",
  "version": "1.0.0",
  "services": {
    "database": {
      "status": "connected",
      "responseTime": "5ms",
      "connections": 15
    },
    "email": {
      "status": "operational",
      "queueSize": 3
    },
    "cache": {
      "status": "connected",
      "hitRate": "95%"
    }
  },
  "resources": {
    "cpu": "45%",
    "memory": "512MB / 2GB",
    "disk": "10GB / 100GB"
  }
}
```

---

## Error Responses

All endpoints may return these error responses:

**401 Unauthorized** - Not authenticated
```json
{
  "error": "Authentication required"
}
```

**403 Forbidden** - Insufficient permissions
```json
{
  "error": "You do not have permission to access this resource"
}
```

**404 Not Found** - Resource not found
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error** - Server error
```json
{
  "error": "An internal server error occurred"
}
```

---

## Example Usage

### TypeScript/Angular

```typescript
// Get dashboard stats
const stats = await this.http.get<DashboardStats>(
  `${environment.apiUrl}/dashboard/stats`,
  { withCredentials: true }
).toPromise();

// Get user trends
const trends = await this.http.get(
  `${environment.apiUrl}/dashboard/user-trends`,
  {
    params: { period: '30d', groupBy: 'day' },
    withCredentials: true
  }
).toPromise();

// Get activity log
const activity = await this.http.get(
  `${environment.apiUrl}/dashboard/activity`,
  {
    params: { page: '1', limit: '20', type: 'login' },
    withCredentials: true
  }
).toPromise();
```

### cURL

```bash
# Get dashboard stats (with cookies)
curl -X GET http://localhost:4005/api/dashboard/stats \
  -b cookies.txt

# Get user trends
curl -X GET "http://localhost:4005/api/dashboard/user-trends?period=30d&groupBy=day" \
  -b cookies.txt

# Export users to CSV
curl -X GET "http://localhost:4005/api/dashboard/export?type=users&format=csv" \
  -b cookies.txt \
  -o users.csv
```

## See Also

- [Authentication API](./api-auth.md) - Authentication endpoints
- [Dashboard Guide](./dashboard.md) - Dashboard features and usage
- [Error Handling](./error-handling.md) - Error response reference
