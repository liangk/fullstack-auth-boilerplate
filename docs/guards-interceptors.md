# Guards & Interceptors

Complete guide to route guards and HTTP interceptors in StackInsight Auth Lite.

## Route Guards

Route guards protect routes from unauthorized access and control navigation flow.

### AuthGuard

Protects routes that require authentication.

**Location:** `src/app/auth/guards/auth.guard.ts`

**Purpose:** Prevent unauthenticated users from accessing protected routes.

**Implementation:**
```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }

      // Redirect to login with return URL
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    })
  );
};
```

**Usage in Routes:**
```typescript
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  }
];
```

**Features:**
- Checks authentication status
- Redirects to login if not authenticated
- Preserves return URL for post-login redirect
- Uses observable-based approach

---

### NoAuthGuard

Prevents authenticated users from accessing auth pages.

**Location:** `src/app/auth/guards/no-auth.guard.ts`

**Purpose:** Redirect authenticated users away from login/register pages.

**Implementation:**
```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        return true;
      }

      // Redirect to dashboard if already authenticated
      router.navigate(['/dashboard']);
      return false;
    })
  );
};
```

**Usage in Routes:**
```typescript
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [noAuthGuard]
  }
];
```

---

### RoleGuard (Optional Enhancement)

Protects routes based on user roles.

**Location:** `src/app/auth/guards/role.guard.ts`

**Purpose:** Restrict access to specific user roles (admin, user, etc.)

**Implementation:**
```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRoles = route.data['roles'] as string[];

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (!user) {
        router.navigate(['/login']);
        return false;
      }

      // Check if user has required role
      const hasRole = requiredRoles.some(role => user.roles?.includes(role));
      
      if (!hasRole) {
        router.navigate(['/unauthorized']);
        return false;
      }

      return true;
    })
  );
};
```

**Usage:**
```typescript
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  }
];
```

---

### CanDeactivateGuard (Optional)

Prevents navigation away from unsaved changes.

**Implementation:**
```typescript
import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = 
  (component) => {
    return component.canDeactivate ? component.canDeactivate() : true;
  };
```

**Component Implementation:**
```typescript
export class EditComponent implements CanComponentDeactivate {
  hasUnsavedChanges = false;

  canDeactivate(): boolean {
    if (this.hasUnsavedChanges) {
      return confirm('You have unsaved changes. Do you want to leave?');
    }
    return true;
  }
}
```

---

## HTTP Interceptors

Interceptors modify HTTP requests and responses globally.

### AuthInterceptor

Handles authentication for HTTP requests.

**Location:** `src/app/auth/interceptors/auth.interceptor.ts`

**Purpose:**
- Add credentials to requests
- Handle token refresh
- Global error handling

**Implementation:**
```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Clone request with credentials
  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expired or invalid
        router.navigate(['/login']);
      } else if (error.status === 403) {
        // Forbidden - insufficient permissions
        router.navigate(['/unauthorized']);
      }

      return throwError(() => error);
    })
  );
};
```

**Registration:**
```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
```

---

### LoadingInterceptor

Shows/hides loading indicator for HTTP requests.

**Location:** `src/app/shared/interceptors/loading.interceptor.ts`

**Purpose:** Automatically manage loading state during HTTP calls.

**Implementation:**
```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Show loading spinner
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      // Hide loading spinner when request completes
      loadingService.hide();
    })
  );
};
```

---

### ErrorInterceptor

Handles HTTP errors globally.

**Location:** `src/app/shared/interceptors/error.interceptor.ts`

**Purpose:** Centralized error handling and logging.

**Implementation:**
```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        errorMessage = error.error?.error || error.message;
      }

      // Log error
      console.error('HTTP Error:', error);

      // Show error message to user
      errorService.showError(errorMessage);

      return throwError(() => error);
    })
  );
};
```

---

### CachingInterceptor (Optional)

Caches GET requests for better performance.

**Implementation:**
```typescript
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

const cache = new Map<string, HttpResponse<any>>();

export const cachingInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  const cachedResponse = cache.get(req.url);
  
  if (cachedResponse) {
    // Return cached response
    return of(cachedResponse);
  }

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        // Cache the response
        cache.set(req.url, event);
      }
    })
  );
};
```

---

### RetryInterceptor (Optional)

Retries failed requests with exponential backoff.

**Implementation:**
```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { retry, timer } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({
      count: 3,
      delay: (error: HttpErrorResponse, retryCount) => {
        // Don't retry on 4xx errors (client errors)
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Exponential backoff: 1s, 2s, 4s
        const delayMs = Math.pow(2, retryCount) * 1000;
        console.log(`Retrying request in ${delayMs}ms (attempt ${retryCount + 1})`);
        
        return timer(delayMs);
      }
    })
  );
};
```

---

## Interceptor Chain

Order matters when registering multiple interceptors.

**Recommended Order:**
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        loadingInterceptor,    // 1. Show loading
        authInterceptor,       // 2. Add auth credentials
        retryInterceptor,      // 3. Retry failed requests
        cachingInterceptor,    // 4. Cache responses
        errorInterceptor       // 5. Handle errors
      ])
    )
  ]
};
```

**Execution Flow:**
1. Request goes through interceptors in order (top to bottom)
2. Response comes back through interceptors in reverse order (bottom to top)

---

## Advanced Patterns

### Conditional Interceptor

Skip interceptor for specific requests.

```typescript
export const conditionalInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip for external APIs
  if (req.url.includes('external-api.com')) {
    return next(req);
  }

  // Apply interceptor logic
  const modifiedReq = req.clone({
    // modifications
  });

  return next(modifiedReq);
};
```

### Request Headers

Add custom headers to requests.

```typescript
export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({
    setHeaders: {
      'X-Custom-Header': 'value',
      'X-Request-ID': generateRequestId()
    }
  });

  return next(modifiedReq);
};
```

### Response Transformation

Transform response data globally.

```typescript
export const transformInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map(event => {
      if (event instanceof HttpResponse) {
        // Transform response body
        const transformedBody = transformData(event.body);
        return event.clone({ body: transformedBody });
      }
      return event;
    })
  );
};
```

---

## Testing

### Testing Guards

```typescript
describe('AuthGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let guard: CanActivateFn;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      isAuthenticated$: of(false)
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    guard = authGuard;
  });

  it('should redirect to login if not authenticated', (done) => {
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/dashboard' } as RouterStateSnapshot;

    TestBed.runInInjectionContext(() => {
      (guard(route, state) as Observable<boolean>).subscribe(result => {
        expect(result).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/login'], {
          queryParams: { returnUrl: '/dashboard' }
        });
        done();
      });
    });
  });
});
```

### Testing Interceptors

```typescript
describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideHttpClient(withInterceptors([authInterceptor]))
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should add withCredentials to request', () => {
    const http = TestBed.inject(HttpClient);

    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });
});
```

---

## Best Practices

### Guards
1. **Keep Logic Simple** - Complex logic belongs in services
2. **Return Observables** - Allows async operations
3. **Handle Errors** - Always catch and handle errors gracefully
4. **Preserve State** - Save return URLs for post-auth redirects

### Interceptors
1. **Order Matters** - Register interceptors in logical order
2. **Handle Errors** - Always include error handling
3. **Avoid Side Effects** - Keep interceptors pure when possible
4. **Don't Block** - Avoid long-running synchronous operations
5. **Clean Up** - Complete observables properly

### Security
1. **Validate on Backend** - Never trust client-side guards alone
2. **Use HTTPS** - Always use secure connections in production
3. **Token Security** - Let cookies handle token storage
4. **Rate Limiting** - Implement on both client and server

---

## Common Patterns

### Retry with Delay
```typescript
return next(req).pipe(
  retryWhen(errors => 
    errors.pipe(
      delay(1000),
      take(3)
    )
  )
);
```

### Request Timeout
```typescript
return next(req).pipe(
  timeout(30000), // 30 seconds
  catchError(error => {
    if (error.name === 'TimeoutError') {
      return throwError(() => new Error('Request timeout'));
    }
    return throwError(() => error);
  })
);
```

### Progressive Loading
```typescript
let loadingShown = false;

return next(req).pipe(
  delay(300), // Only show loading after 300ms
  tap(() => {
    if (!loadingShown) {
      loadingService.show();
      loadingShown = true;
    }
  }),
  finalize(() => {
    if (loadingShown) {
      loadingService.hide();
    }
  })
);
```

---

## Troubleshooting

### Guard Not Firing
- Check guard is registered in route configuration
- Verify service dependencies are provided
- Check for errors in console

### Interceptor Not Applied
- Ensure interceptor is registered in app config
- Check interceptor order
- Verify HttpClient is used (not native fetch)

### Redirect Loops
- Check for circular guard logic
- Verify authentication state is properly managed
- Add guards to prevent loops

---

## See Also

- [Frontend Architecture](./frontend-architecture.md) - Overall structure
- [Services Guide](./services.md) - Service documentation
- [Security Best Practices](./security.md) - Security implementation
