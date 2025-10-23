# Frontend Architecture

Comprehensive guide to the Angular frontend architecture in StackInsight Auth Lite.

## Tech Stack

- **Framework**: Angular 20
- **UI Library**: Angular Material
- **Styling**: SCSS
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **State Management**: Services + RxJS
- **Forms**: Reactive Forms (ngx-lite-form)

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── auth/                    # Authentication module
│   │   │   ├── components/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── verify-email/
│   │   │   │   ├── forgot-password/
│   │   │   │   └── reset-password/
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── no-auth.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts
│   │   │   └── services/
│   │   │       └── auth.service.ts
│   │   ├── dashboard/               # Dashboard module
│   │   │   ├── components/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── stats-card/
│   │   │   │   ├── user-chart/
│   │   │   │   └── activity-log/
│   │   │   └── services/
│   │   │       └── dashboard.service.ts
│   │   ├── shared/                  # Shared module
│   │   │   ├── components/
│   │   │   │   ├── header/
│   │   │   │   ├── footer/
│   │   │   │   └── loading-spinner/
│   │   │   └── services/
│   │   │       ├── loading.service.ts
│   │   │       └── error.service.ts
│   │   ├── models/                  # TypeScript interfaces
│   │   │   ├── user.model.ts
│   │   │   ├── auth.model.ts
│   │   │   └── dashboard.model.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.ts           # Production config
│   │   └── environment.development.ts
│   ├── assets/
│   ├── styles.scss                  # Global styles
│   └── index.html
├── angular.json
├── package.json
├── tsconfig.json
└── Dockerfile
```

## Module Architecture

### Core Modules

#### 1. App Module
Main application module that bootstraps the app.

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideNativeDateAdapter(),
    // ... other providers
  ]
};
```

#### 2. Auth Module
Handles all authentication-related functionality.

**Components:**
- Login
- Register
- Verify Email
- Forgot Password
- Reset Password

**Services:**
- AuthService - Authentication logic
- UserService - User data management

**Guards:**
- AuthGuard - Protect authenticated routes
- NoAuthGuard - Protect public routes (login, register)

#### 3. Dashboard Module
Administrative dashboard with analytics and user management.

**Components:**
- Dashboard - Main dashboard view
- StatsCard - Statistics display
- UserChart - User registration charts
- ActivityLog - Activity log table

**Services:**
- DashboardService - Dashboard data fetching

#### 4. Shared Module
Reusable components and services used across the app.

**Components:**
- Header - Navigation bar
- Footer - Page footer
- LoadingSpinner - Loading indicator

**Services:**
- LoadingService - Global loading state
- ErrorService - Global error handling

## Routing Structure

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'verify-email/:token',
    component: VerifyEmailComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
```

## State Management

### Service-Based State

Uses RxJS `BehaviorSubject` for reactive state management.

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: User | null) {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(!!user);
  }
}
```

### Loading State

```typescript
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }
}
```

## HTTP Communication

### Base Configuration

```typescript
// environment.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.stackinsight.app/api'
};
```

### HTTP Interceptor

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Add withCredentials for cookies
  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle errors globally
      return throwError(() => error);
    })
  );
};
```

### Service Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      { email, password },
      { withCredentials: true }
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/me`,
      { withCredentials: true }
    );
  }
}
```

## Form Handling

### Reactive Forms with ngx-lite-form

```typescript
import { LiteFormBuilder } from 'ngx-lite-form';

export class LoginComponent {
  loginForm = this.fb.form({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(private fb: LiteFormBuilder) {}

  onSubmit() {
    if (this.loginForm.invalid) return;
    
    const { email, password } = this.loginForm.value;
    // Handle login
  }
}
```

### Form Validation

```typescript
// Custom validators
export class CustomValidators {
  static strongPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 8;

    const valid = hasUpper && hasLower && hasNumber && isLongEnough;
    return valid ? null : { weakPassword: true };
  }
}
```

## Component Patterns

### Smart vs Presentational Components

**Smart Components (Container):**
- Handle business logic
- Connect to services
- Manage state
- Pass data to presentational components

```typescript
// dashboard.component.ts (Smart)
export class DashboardComponent implements OnInit {
  stats$ = this.dashboardService.getStats();
  
  constructor(private dashboardService: DashboardService) {}
}
```

**Presentational Components:**
- Receive data via @Input
- Emit events via @Output
- No direct service injection
- Focus on UI/presentation

```typescript
// stats-card.component.ts (Presentational)
export class StatsCardComponent {
  @Input() title!: string;
  @Input() value!: number;
  @Input() icon!: string;
}
```

### Lifecycle Hooks

```typescript
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Initialize component
    this.loadData();
  }

  ngOnDestroy() {
    // Cleanup subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData() {
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Handle data
      });
  }
}
```

## Styling Architecture

### SCSS Structure

```scss
// styles.scss
@use '@angular/material' as mat;

// Theme
$primary: mat.define-palette(mat.$indigo-palette);
$accent: mat.define-palette(mat.$pink-palette);

// Global styles
* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  background: #f6f6f6;
}

// Component-specific styles in component.scss
```

### Component Styles

```scss
// login.component.scss
:host {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-card {
  max-width: 400px;
  width: 100%;
  padding: 2rem;
}
```

## Performance Optimization

### Lazy Loading

```typescript
// Future enhancement
const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes')
      .then(m => m.DASHBOARD_ROUTES)
  }
];
```

### OnPush Change Detection

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent {}
```

### TrackBy Functions

```html
<div *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</div>
```

```typescript
trackById(index: number, item: any): number {
  return item.id;
}
```

## Build & Deployment

### Development Build

```bash
npm start
# Runs on http://localhost:4200
```

### Production Build

```bash
npm run build --prod
# Output in dist/frontend/
```

### Docker Build

```dockerfile
# Multi-stage build
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --prod

FROM nginx:alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Testing Strategy

### Unit Tests

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

  it('should login successfully', () => {
    const mockResponse = { user: { email: 'test@example.com' } };
    
    service.login('test@example.com', 'password').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
```

## Best Practices

### Code Organization
- One component per file
- Group related files in feature folders
- Use index.ts for cleaner imports
- Keep components focused and small

### Naming Conventions
- Components: PascalCase (LoginComponent)
- Services: PascalCase + Service (AuthService)
- Interfaces: PascalCase (User, LoginRequest)
- Constants: UPPER_SNAKE_CASE

### TypeScript
- Enable strict mode
- Use interfaces for data models
- Avoid `any` type
- Use proper typing for Observables

### Angular Specifics
- Use async pipe for subscriptions
- Unsubscribe in ngOnDestroy
- Use OnPush change detection
- Leverage Angular Material components

## See Also

- [Components Guide](./components.md) - Detailed component documentation
- [Services Guide](./services.md) - Service architecture
- [Guards & Interceptors](./guards-interceptors.md) - Route protection
