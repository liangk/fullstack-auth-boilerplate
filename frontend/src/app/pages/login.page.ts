import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MaterialModule } from '../material.module';
import { FieldDto, LiteSnackbarService, LiteInput, LitePassword } from 'ngx-lite-form';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MaterialModule, LiteInput, LitePassword],
  template: `
    <div class="login_content">
      <div class="title2">Login</div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
        <lite-input [control]="email"></lite-input>
        <lite-password [control]="password"></lite-password>
        <div class="actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">Login</button>
          <div class="links">
            <a routerLink="/forgot-password">Forgot password?</a>
            <a routerLink="/register">Register</a>
          </div>
        </div>
      </form>
    </div>
  `,
  styleUrl: './pages.scss'
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackbar = inject(LiteSnackbarService)

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  email: FieldDto = {label: 'Email', formControl: this.form.get('email') as FormControl};
  password: FieldDto = {label: 'Password', formControl: this.form.get('password') as FormControl};

  loading = false;

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        this.snackbar.show('Logged in successfully', 'done', 3000);
        this.router.navigateByUrl('/');
      },
      error: (e) => {
        const msg = e?.error?.message || 'Login failed';
        this.snackbar.show(msg, 'error', 3500);
      }
    }).add(() => this.loading = false);
  }
}
