import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MaterialModule } from '../material.module';
import { FieldDto } from 'ngx-lite-form';
import { LiteSnackbarService } from 'ngx-lite-form';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, RouterLink],
  template: `
    <div class="register_content">
      <div class="title2">Reset Password</div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate *ngIf="!success">
        <lite-password [control]="password"></lite-password>
        <lite-password [control]="confirmPassword"></lite-password>
        <div class="actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </div>
      </form>
      <div *ngIf="success" class="success-message">
        <p>Password reset successfully!</p>
        <button mat-raised-button color="primary" routerLink="/login">Continue to Login</button>
      </div>
    </div>
  `,
  styleUrl: './pages.scss'
})
export class ResetPasswordPage implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snack = inject(LiteSnackbarService);

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  loading = false;
  success = false;
  token = '';

  password: FieldDto = {label: 'New Password', formControl: this.form.get('password') as FormControl};
  confirmPassword: FieldDto = {label: 'Confirm Password', formControl: this.form.get('confirmPassword') as FormControl};

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      this.snack.show('Invalid reset link', 'error', 3500);
      this.router.navigateByUrl('/login');
    }
  }

  passwordMatchValidator(form: any) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.form.invalid || !this.token) return;
    this.loading = true;
    this.auth.resetPassword(this.token, this.form.value.password as string).subscribe({
      next: () => {
        this.success = true;
        this.snack.show('Password reset successfully', 'done', 3000);
      },
      error: (e) => {
        const msg = e?.error?.message || 'Failed to reset password';
        this.snack.show(msg, 'error', 3500);
      }
    }).add(() => this.loading = false);
  }
}
