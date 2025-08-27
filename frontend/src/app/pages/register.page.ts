import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <div class="centered">
      <mat-card class="auth-card mat-elevation-z4">
        <h1>Register</h1>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" required autocomplete="email">
            <mat-error *ngIf="email.touched && email.hasError('required')">Email is required</mat-error>
            <mat-error *ngIf="email.touched && email.hasError('email')">Enter a valid email</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Password</mat-label>
            <input matInput [type]="hide ? 'password' : 'text'" formControlName="password" required autocomplete="new-password">
            <button mat-icon-button matSuffix type="button" (click)="hide = !hide" [attr.aria-label]="hide ? 'Show password' : 'Hide password'" [attr.aria-pressed]="!hide">
              <mat-icon>{{ hide ? 'visibility' : 'visibility_off' }}</mat-icon>
            </button>
            <mat-hint align="end">Min 6 characters</mat-hint>
            <mat-error *ngIf="password.touched && password.hasError('required')">Password is required</mat-error>
            <mat-error *ngIf="password.touched && password.hasError('minlength')">Password must be at least 6 characters</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Name</mat-label>
            <input matInput type="text" formControlName="name" autocomplete="name">
          </mat-form-field>

          <div class="actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
              <mat-progress-spinner *ngIf="loading" diameter="18" mode="indeterminate"></mat-progress-spinner>
              <span *ngIf="!loading">Create account</span>
            </button>
            <a routerLink="/login" mat-button>Back to login</a>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`mat-card h1 { margin: 0 0 8px; }`]
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    name: ['']
  });

  hide = true;
  loading = false;

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.register(this.form.value as any).subscribe({
      next: () => {
        this.snack.open('Account created', 'Close', { duration: 2500, panelClass: 'snackbar-success' });
        this.router.navigateByUrl('/');
      },
      error: (e) => {
        const msg = e?.error?.message || 'Registration failed';
        this.snack.open(msg, 'Close', { duration: 3500, panelClass: 'snackbar-error' });
      }
    }).add(() => this.loading = false);
  }
}
