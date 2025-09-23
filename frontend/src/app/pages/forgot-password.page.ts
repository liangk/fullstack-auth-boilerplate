import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MaterialModule } from '../material.module';
import { FieldDto, LiteSnackbarService, LiteInput } from 'ngx-lite-form';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MaterialModule, LiteInput],
  template: `
    <div class="register_content">
      <div class="title2">Forgot Password</div>
      <p>Enter your email address and we'll send you a link to reset your password.</p>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
        <lite-input [control]="email"></lite-input>
        <div class="actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>
          <a routerLink="/login">Back to Login</a>
        </div>
      </form>
    </div>
  `,
  styleUrl: './pages.scss'
})
export class ForgotPasswordPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(LiteSnackbarService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  loading = false;
  email: FieldDto = {label: 'Email', formControl: this.form.get('email') as FormControl};

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.forgotPassword(this.form.value.email as string).subscribe({
      next: (response) => {
        this.snack.show(response.message, 'done', 4000);
        this.router.navigateByUrl('/login');
      },
      error: (e) => {
        const msg = e?.error?.message || 'Failed to send reset email';
        this.snack.show(msg, 'error', 3500);
      }
    }).add(() => this.loading = false);
  }
}
