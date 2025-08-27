import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <mat-card>
      <h1>Register</h1>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill" class="full">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required>
        </mat-form-field>
        <mat-form-field appearance="fill" class="full">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" required>
        </mat-form-field>
        <mat-form-field appearance="fill" class="full">
          <mat-label>Name</mat-label>
          <input matInput type="text" formControlName="name">
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Create account</button>
        <a routerLink="/login" style="margin-left: 8px;">Back to login</a>
      </form>
    </mat-card>
  `,
  styles: [`.full { width: 100%; } mat-card { max-width: 400px; margin: 32px auto; }`]
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    name: ['']
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.auth.register(this.form.value as any).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (e) => console.error(e)
    });
  }
}
