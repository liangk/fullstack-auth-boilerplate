# Components Guide

Detailed documentation for all Angular components in StackInsight Auth Lite.

## Component Categories

- **Auth Components** - Authentication and user management
- **Dashboard Components** - Analytics and admin features
- **Shared Components** - Reusable UI components

---

## Auth Components

### LoginComponent

User login form with email and password.

**Location:** `src/app/auth/components/login/`

**Route:** `/login`

**Features:**
- Email and password fields
- Form validation
- Remember me checkbox
- Forgot password link
- Loading indicator during login
- Error message display

**Template:**
```html
<div class="login-container">
  <mat-card class="login-card">
    <mat-card-header>
      <mat-card-title>Login</mat-card-title>
    </mat-card-header>
    
    <mat-card-content>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email">
          <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
            Email is required
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password">
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit">
          Login
        </button>
      </form>
    </mat-card-content>
  </mat-card>
</div>
```

**Component Logic:**
```typescript
export class LoginComponent {
  loginForm = this.fb.form({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: LiteFormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Login failed';
        this.isLoading = false;
      }
    });
  }
}
```

---

### RegisterComponent

New user registration form.

**Location:** `src/app/auth/components/register/`

**Route:** `/register`

**Features:**
- Email, password, and name fields
- Password strength indicator
- Form validation
- Terms of service checkbox
- Email verification notice
- Link to login page

**Form Validation:**
```typescript
registerForm = this.fb.form({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [
    Validators.required,
    Validators.minLength(8),
    CustomValidators.strongPassword
  ]],
  confirmPassword: ['', Validators.required],
  name: ['', [Validators.minLength(2), Validators.maxLength(100)]],
  acceptTerms: [false, Validators.requiredTrue]
}, {
  validators: CustomValidators.passwordMatch
});
```

**Custom Validators:**
```typescript
static passwordMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
```

---

### VerifyEmailComponent

Email verification page accessed via token link.

**Location:** `src/app/auth/components/verify-email/`

**Route:** `/verify-email/:token`

**Features:**
- Automatic verification on load
- Success/error message display
- Link to login page
- Resend verification option

**Component Logic:**
```typescript
export class VerifyEmailComponent implements OnInit {
  verificationStatus: 'loading' | 'success' | 'error' = 'loading';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    
    if (!token) {
      this.verificationStatus = 'error';
      this.message = 'Invalid verification link';
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: (response) => {
        this.verificationStatus = 'success';
        this.message = response.message;
      },
      error: (error) => {
        this.verificationStatus = 'error';
        this.message = error.error?.error || 'Verification failed';
      }
    });
  }
}
```

---

### ForgotPasswordComponent

Password reset request form.

**Location:** `src/app/auth/components/forgot-password/`

**Route:** `/forgot-password`

**Features:**
- Email input field
- Submission confirmation
- Back to login link
- Rate limiting notice

**Template:**
```html
<mat-card class="forgot-password-card">
  <mat-card-header>
    <mat-card-title>Forgot Password</mat-card-title>
  </mat-card-header>

  <mat-card-content>
    <p>Enter your email and we'll send you a password reset link.</p>
    
    <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <mat-label>Email</mat-label>
        <input matInput type="email" formControlName="email">
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit">
        Send Reset Link
      </button>
    </form>

    <div *ngIf="submitted" class="success-message">
      If an account exists with this email, you will receive a password reset link.
    </div>
  </mat-card-content>
</mat-card>
```

---

### ResetPasswordComponent

Password reset form with token validation.

**Location:** `src/app/auth/components/reset-password/`

**Route:** `/reset-password/:token`

**Features:**
- New password and confirm password fields
- Password strength indicator
- Token validation
- Success redirect to login

---

## Dashboard Components

### DashboardComponent

Main dashboard view with statistics and charts.

**Location:** `src/app/dashboard/components/dashboard/`

**Route:** `/dashboard`

**Features:**
- Statistics cards
- User registration chart
- Recent activity log
- Quick actions menu

**Template Structure:**
```html
<div class="dashboard-container">
  <h1>Dashboard</h1>

  <!-- Statistics Cards -->
  <div class="stats-grid">
    <app-stats-card
      *ngFor="let stat of stats"
      [title]="stat.title"
      [value]="stat.value"
      [icon]="stat.icon">
    </app-stats-card>
  </div>

  <!-- User Chart -->
  <mat-card class="chart-card">
    <mat-card-header>
      <mat-card-title>User Registrations</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <app-user-chart [data]="chartData"></app-user-chart>
    </mat-card-content>
  </mat-card>

  <!-- Activity Log -->
  <app-activity-log [activities]="recentActivities"></app-activity-log>
</div>
```

**Component Logic:**
```typescript
export class DashboardComponent implements OnInit {
  stats: DashboardStats[] = [];
  chartData: ChartData | null = null;
  recentActivities: Activity[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.dashboardService.getStats().subscribe(data => {
      this.stats = [
        { title: 'Total Users', value: data.totalUsers, icon: 'people' },
        { title: 'Verified', value: data.verifiedUsers, icon: 'verified_user' },
        { title: 'New Today', value: data.newUsersToday, icon: 'today' },
        { title: 'Active', value: data.activeUsers, icon: 'trending_up' }
      ];
    });

    this.dashboardService.getUserTrends().subscribe(data => {
      this.chartData = data;
    });

    this.dashboardService.getRecentActivity().subscribe(data => {
      this.recentActivities = data.activities;
    });
  }
}
```

---

### StatsCardComponent

Reusable statistics card component.

**Location:** `src/app/dashboard/components/stats-card/`

**Usage:**
```html
<app-stats-card
  title="Total Users"
  [value]="1234"
  icon="people">
</app-stats-card>
```

**Component:**
```typescript
@Component({
  selector: 'app-stats-card',
  template: `
    <mat-card class="stats-card">
      <div class="card-content">
        <mat-icon>{{ icon }}</mat-icon>
        <div class="stats-info">
          <h3>{{ value | number }}</h3>
          <p>{{ title }}</p>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .stats-card { padding: 1.5rem; }
    .card-content { display: flex; align-items: center; gap: 1rem; }
    mat-icon { font-size: 48px; width: 48px; height: 48px; color: var(--primary-color); }
    .stats-info h3 { margin: 0; font-size: 2rem; }
    .stats-info p { margin: 0.25rem 0 0; color: #666; }
  `]
})
export class StatsCardComponent {
  @Input() title!: string;
  @Input() value!: number;
  @Input() icon!: string;
}
```

---

### UserChartComponent

Chart displaying user registration trends.

**Location:** `src/app/dashboard/components/user-chart/`

**Features:**
- Line/bar chart visualization
- Time period selection
- Responsive design
- Hover tooltips

**Props:**
```typescript
@Input() data!: ChartData;
@Input() type: 'line' | 'bar' = 'line';
@Input() period: '7d' | '30d' | '90d' = '30d';
```

---

### ActivityLogComponent

Table displaying recent user activities.

**Location:** `src/app/dashboard/components/activity-log/`

**Features:**
- Paginated table
- Activity type filtering
- User search
- Timestamp display

**Template:**
```html
<mat-card>
  <mat-card-header>
    <mat-card-title>Recent Activity</mat-card-title>
  </mat-card-header>

  <mat-card-content>
    <table mat-table [dataSource]="dataSource">
      <ng-container matColumnDef="type">
        <th mat-header-cell *matHeaderCellDef>Type</th>
        <td mat-cell *matCellDef="let activity">{{ activity.type }}</td>
      </ng-container>

      <ng-container matColumnDef="user">
        <th mat-header-cell *matHeaderCellDef>User</th>
        <td mat-cell *matCellDef="let activity">{{ activity.userEmail }}</td>
      </ng-container>

      <ng-container matColumnDef="timestamp">
        <th mat-header-cell *matHeaderCellDef>Time</th>
        <td mat-cell *matCellDef="let activity">
          {{ activity.timestamp | date:'short' }}
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>

    <mat-paginator [length]="totalItems" [pageSize]="20"></mat-paginator>
  </mat-card-content>
</mat-card>
```

---

## Shared Components

### HeaderComponent

Application header with navigation.

**Location:** `src/app/shared/components/header/`

**Features:**
- App logo
- Navigation links
- User menu
- Logout button
- Responsive mobile menu

**Template:**
```html
<mat-toolbar color="primary">
  <button mat-icon-button (click)="toggleSidenav()">
    <mat-icon>menu</mat-icon>
  </button>

  <span class="logo">StackInsight Auth Lite</span>

  <span class="spacer"></span>

  <button mat-button routerLink="/dashboard">Dashboard</button>
  
  <button mat-icon-button [matMenuTriggerFor]="userMenu">
    <mat-icon>account_circle</mat-icon>
  </button>

  <mat-menu #userMenu="matMenu">
    <button mat-menu-item>
      <mat-icon>person</mat-icon>
      <span>Profile</span>
    </button>
    <button mat-menu-item (click)="logout()">
      <mat-icon>exit_to_app</mat-icon>
      <span>Logout</span>
    </button>
  </mat-menu>
</mat-toolbar>
```

---

### FooterComponent

Application footer.

**Location:** `src/app/shared/components/footer/`

**Features:**
- Copyright notice
- Links to documentation
- Social media links

---

### LoadingSpinnerComponent

Global loading indicator.

**Location:** `src/app/shared/components/loading-spinner/`

**Usage:**
```html
<app-loading-spinner *ngIf="isLoading"></app-loading-spinner>
```

**Component:**
```typescript
@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="spinner-overlay">
      <mat-spinner></mat-spinner>
    </div>
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
  `]
})
export class LoadingSpinnerComponent {}
```

---

## Component Best Practices

### 1. Single Responsibility
Each component should have one clear purpose.

### 2. Input/Output Pattern
```typescript
@Input() data: any;
@Output() dataChange = new EventEmitter<any>();
```

### 3. OnPush Change Detection
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 4. Unsubscribe Pattern
```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.service.data$
    .pipe(takeUntil(this.destroy$))
    .subscribe();
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### 5. Template Best Practices
- Use async pipe for observables
- Use trackBy for *ngFor
- Avoid complex logic in templates
- Extract reusable parts into components

## See Also

- [Frontend Architecture](./frontend-architecture.md) - Overall structure
- [Services Guide](./services.md) - Service layer documentation
- [Guards & Interceptors](./guards-interceptors.md) - Route protection
