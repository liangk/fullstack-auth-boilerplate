# Services Guide

Complete documentation for all Angular services in StackInsight Auth Lite.

## Service Categories

- **Auth Services** - Authentication and user management
- **Dashboard Services** - Dashboard data and analytics
- **Shared Services** - Global utilities and state management

---

## Auth Services

### AuthService

Core authentication service handling login, logout, and user state.

**Location:** `src/app/auth/services/auth.service.ts`

**Responsibilities:**
- User login and logout
- Token management (handled by cookies)
- Current user state
- Authentication status

**API:**
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  // Check authentication status on app load
  private checkAuthStatus(): void {
    this.getCurrentUser().subscribe({
      next: (user) => this.setCurrentUser(user),
      error: () => this.setCurrentUser(null)
    });
  }

  // Login user
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      { email, password },
      { withCredentials: true }
    ).pipe(
      tap(response => this.setCurrentUser(response.user))
    );
  }

  // Logout user
  logout(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.setCurrentUser(null);
        this.router.navigate(['/login']);
      })
    );
  }

  // Register new user
  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      data,
      { withCredentials: true }
    );
  }

  // Get current user profile
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/me`,
      { withCredentials: true }
    );
  }

  // Update user profile
  updateProfile(data: UpdateProfileRequest): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/profile`,
      data,
      { withCredentials: true }
    ).pipe(
      tap(user => this.setCurrentUser(user))
    );
  }

  // Verify email with token
  verifyEmail(token: string): Observable<VerifyEmailResponse> {
    return this.http.get<VerifyEmailResponse>(
      `${this.apiUrl}/verify-email/${token}`
    );
  }

  // Request password reset
  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(
      `${this.apiUrl}/forgot-password`,
      { email }
    );
  }

  // Reset password with token
  resetPassword(token: string, newPassword: string): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(
      `${this.apiUrl}/reset-password/${token}`,
      { newPassword }
    );
  }

  // Change password for authenticated user
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/change-password`,
      { currentPassword, newPassword },
      { withCredentials: true }
    );
  }

  // Set current user and auth state
  private setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(!!user);
  }

  // Get current user value (synchronous)
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is authenticated (synchronous)
  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
```

**Usage Example:**
```typescript
export class LoginComponent {
  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.login(email, password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (error) => this.showError(error)
    });
  }
}
```

---

### UserService

User data management and profile operations.

**Location:** `src/app/auth/services/user.service.ts`

**Responsibilities:**
- User CRUD operations
- Profile management
- User preferences

**API:**
```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // Get user by ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/${id}`,
      { withCredentials: true }
    );
  }

  // Get all users (admin only)
  getAllUsers(params?: UserQueryParams): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(
      this.apiUrl,
      { params, withCredentials: true }
    );
  }

  // Delete user account
  deleteAccount(password: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/account`,
      { body: { password }, withCredentials: true }
    );
  }
}
```

---

## Dashboard Services

### DashboardService

Dashboard data and analytics service.

**Location:** `src/app/dashboard/services/dashboard.service.ts`

**Responsibilities:**
- Fetch dashboard statistics
- Load user trends
- Get activity logs
- Export data

**API:**
```typescript
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  // Get dashboard statistics
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(
      `${this.apiUrl}/stats`,
      { withCredentials: true }
    );
  }

  // Get user registration trends
  getUserTrends(params?: TrendQueryParams): Observable<UserTrendData> {
    return this.http.get<UserTrendData>(
      `${this.apiUrl}/user-trends`,
      { params, withCredentials: true }
    );
  }

  // Get activity log
  getActivity(params?: ActivityQueryParams): Observable<ActivityLogResponse> {
    return this.http.get<ActivityLogResponse>(
      `${this.apiUrl}/activity`,
      { params, withCredentials: true }
    );
  }

  // Get recent activity
  getRecentActivity(limit: number = 10): Observable<ActivityLogResponse> {
    return this.http.get<ActivityLogResponse>(
      `${this.apiUrl}/activity`,
      { 
        params: { limit: limit.toString() },
        withCredentials: true 
      }
    );
  }

  // Get user list
  getUsers(params?: UserQueryParams): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(
      `${this.apiUrl}/users`,
      { params, withCredentials: true }
    );
  }

  // Get user details
  getUserDetails(userId: string): Observable<UserDetailsResponse> {
    return this.http.get<UserDetailsResponse>(
      `${this.apiUrl}/users/${userId}`,
      { withCredentials: true }
    );
  }

  // Get login statistics
  getLoginStats(period: string = '30d'): Observable<LoginStatsResponse> {
    return this.http.get<LoginStatsResponse>(
      `${this.apiUrl}/login-stats`,
      { params: { period }, withCredentials: true }
    );
  }

  // Export dashboard data
  exportData(type: string, format: string = 'json'): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/export`,
      {
        params: { type, format },
        responseType: 'blob',
        withCredentials: true
      }
    );
  }

  // Get system health
  getSystemHealth(): Observable<SystemHealthResponse> {
    return this.http.get<SystemHealthResponse>(
      `${this.apiUrl}/health`,
      { withCredentials: true }
    );
  }
}
```

**Usage Example:**
```typescript
export class DashboardComponent implements OnInit {
  stats$ = this.dashboardService.getStats();
  trends$ = this.dashboardService.getUserTrends({ period: '30d' });

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.stats$.subscribe(stats => {
      console.log('Dashboard stats:', stats);
    });
  }
}
```

---

## Shared Services

### LoadingService

Global loading state management.

**Location:** `src/app/shared/services/loading.service.ts`

**Responsibilities:**
- Show/hide global loading spinner
- Track loading state

**API:**
```typescript
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private loadingCount = 0;

  show(): void {
    this.loadingCount++;
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    if (this.loadingCount === 0) {
      this.loadingSubject.next(false);
    }
  }

  reset(): void {
    this.loadingCount = 0;
    this.loadingSubject.next(false);
  }

  get isLoading(): boolean {
    return this.loadingSubject.value;
  }
}
```

**Usage:**
```typescript
// In component
constructor(private loadingService: LoadingService) {}

loadData() {
  this.loadingService.show();
  this.dataService.getData().subscribe({
    next: (data) => {
      this.data = data;
      this.loadingService.hide();
    },
    error: () => this.loadingService.hide()
  });
}

// In template
<app-loading-spinner *ngIf="loadingService.loading$ | async"></app-loading-spinner>
```

---

### ErrorService

Global error handling and display.

**Location:** `src/app/shared/services/error.service.ts`

**Responsibilities:**
- Display error messages
- Format error responses
- Log errors

**API:**
```typescript
@Injectable({ providedIn: 'root' })
export class ErrorService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: any): void {
    const message = this.getErrorMessage(error);
    this.showError(message);
    this.logError(error);
  }

  showError(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  showSuccess(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  showWarning(message: string, duration: number = 4000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  private getErrorMessage(error: any): string {
    if (error.error?.error) {
      return error.error.error;
    }
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }

  private logError(error: any): void {
    console.error('Error:', error);
    // Could send to logging service here
  }
}
```

**Usage:**
```typescript
constructor(private errorService: ErrorService) {}

onSubmit() {
  this.service.submitData(data).subscribe({
    next: () => this.errorService.showSuccess('Data saved successfully'),
    error: (error) => this.errorService.handleError(error)
  });
}
```

---

### NotificationService

User notification management (optional enhancement).

**Location:** `src/app/shared/services/notification.service.ts`

**Responsibilities:**
- Display toast notifications
- Manage notification queue
- Handle different notification types

**API:**
```typescript
@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  private show(message: string, type: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [`${type}-snackbar`]
    });
  }
}
```

---

## Service Patterns

### HTTP Service Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  private apiUrl = `${environment.apiUrl}/endpoint`;

  constructor(private http: HttpClient) {}

  // GET request
  getData(id: string): Observable<Data> {
    return this.http.get<Data>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  // POST request
  createData(data: CreateDataRequest): Observable<Data> {
    return this.http.post<Data>(this.apiUrl, data, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  // PUT request
  updateData(id: string, data: UpdateDataRequest): Observable<Data> {
    return this.http.put<Data>(`${this.apiUrl}/${id}`, data, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE request
  deleteData(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('HTTP Error:', error);
    return throwError(() => error);
  }
}
```

### State Management Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class StateService {
  private stateSubject = new BehaviorSubject<State>(initialState);
  public state$ = this.stateSubject.asObservable();

  get state(): State {
    return this.stateSubject.value;
  }

  setState(newState: Partial<State>): void {
    this.stateSubject.next({
      ...this.state,
      ...newState
    });
  }

  resetState(): void {
    this.stateSubject.next(initialState);
  }
}
```

### Caching Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class CachedDataService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheDuration = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) {}

  getData(id: string): Observable<Data> {
    const cached = this.cache.get(id);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < this.cacheDuration) {
      return of(cached.data);
    }

    return this.http.get<Data>(`/api/data/${id}`).pipe(
      tap(data => {
        this.cache.set(id, { data, timestamp: now });
      })
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}
```

---

## Testing Services

### Unit Test Example

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login successfully', () => {
    const mockResponse = {
      user: { id: '1', email: 'test@example.com' }
    };

    service.login('test@example.com', 'password').subscribe(response => {
      expect(response.user.email).toBe('test@example.com');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    req.flush(mockResponse);
  });

  it('should handle login error', () => {
    service.login('test@example.com', 'wrong').subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
  });
});
```

---

## Best Practices

### 1. Dependency Injection
Always use `providedIn: 'root'` for singleton services.

### 2. RxJS Operators
Use appropriate operators for data transformation:
- `map()` - Transform data
- `tap()` - Side effects
- `catchError()` - Error handling
- `switchMap()` - Cancel previous requests
- `debounceTime()` - Rate limiting

### 3. Error Handling
Always handle errors in services or let them propagate to components.

### 4. Type Safety
Use TypeScript interfaces for request/response types.

### 5. Observable Cleanup
Unsubscribe from observables to prevent memory leaks.

### 6. Service Composition
Inject other services to build more complex functionality.

## See Also

- [Frontend Architecture](./frontend-architecture.md) - Overall structure
- [Components Guide](./components.md) - Component documentation
- [Guards & Interceptors](./guards-interceptors.md) - HTTP interception
