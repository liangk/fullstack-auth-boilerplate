import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MaterialModule } from '../material.module';
import { FieldDto, LiteInput, LitePassword, LiteSnackbarService } from 'ngx-lite-form';
import { CommonModule } from '@angular/common';
import { RegisterResponse } from '../models/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MaterialModule, LiteInput, LitePassword],
  template: `
    <div class="register_content">
      @if (loading) {
        <div class="loading-overlay">
          <mat-spinner diameter="50"></mat-spinner>
        </div>
      }
      <div class="title2">Register</div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
        <lite-input [control]="email"></lite-input>
        <lite-password [control]="password"></lite-password>
        <div class="actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
            @if (loading) {
              <mat-spinner diameter="20" style="display: inline-block; margin-right: 8px;"></mat-spinner>
            }
            Register
          </button>
          <a routerLink="/login">Login</a>
        </div>
      </form>
    </div>
  `,
  styleUrl: './pages.scss'
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(LiteSnackbarService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]]
  });

  loading = false;
  email: FieldDto = {label: 'Email', formControl: this.form.get('email') as FormControl};
  password: FieldDto = {label: 'Password', formControl: this.form.get('password') as FormControl};

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.register(this.form.value as any).subscribe({
      next: (response: RegisterResponse) => {
        this.snack.show(response.message, 'done', 2500);
        if (response.requiresVerification) {
          // Redirect to pending verification page with email as query param
          this.router.navigate(['/pending-verification'], { 
            queryParams: { email: this.form.value.email } 
          });
        } else {
          // Skip verification, go to dashboard
          this.router.navigateByUrl('/');
        }
      },
      error: (e) => {
        const msg = e?.error?.message || 'Registration failed';
        this.snack.show(msg, 'error', 3500);
      }
    }).add(() => this.loading = false);
  }
}
