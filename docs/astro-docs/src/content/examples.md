# Example Use Cases

Practical implementation patterns with StackInsight Auth Lite.

## 1) Protecting a Page (Angular)

```ts
// app.routes.ts
{ path: 'settings', component: SettingsComponent, canActivate: [authGuard] }
```

```html
<!-- settings.component.html -->
<section>
  <h1>Account Settings</h1>
  <app-profile-form></app-profile-form>
</section>
```

## 2) Restricting Admin Area

```ts
{ path: 'admin', component: AdminComponent, canActivate: [authGuard, roleGuard], data: { roles: ['admin'] } }
```

## 3) Calling the API with Cookies

```ts
this.http.get(`${environment.apiUrl}/dashboard/stats`, { withCredentials: true }).subscribe();
```

## 4) Display Current User

```ts
currentUser$ = this.authService.currentUser$;
```

```html
<div *ngIf="currentUser$ | async as user">Welcome, {{ user.name || user.email }}</div>
```

## 5) Email Verification Banner

```html
<mat-card *ngIf="(authService.currentUser$ | async)?.isVerified === false" color="warn">
  <mat-card-content>
    Please verify your email. <a routerLink="/verify-email/resend">Resend</a>
  </mat-card-content>
</mat-card>
```

## 6) Logout Button

```ts
logout() { this.authService.logout().subscribe(); }
```

```html
<button mat-button (click)="logout()">Logout</button>
```

## 7) Showing Errors Nicely

```ts
this.service.action().subscribe({
  error: (err) => this.errorService.handleError(err)
});
```

## 8) Password Strength Validator

```ts
password: ['', [Validators.required, CustomValidators.strongPassword]]
```

## 9) Loading Spinner

```html
<app-loading-spinner *ngIf="loadingService.loading$ | async"></app-loading-spinner>
```

## 10) Resetting State on Logout

```ts
this.authService.logout().subscribe(() => this.stateService.resetState());
```
