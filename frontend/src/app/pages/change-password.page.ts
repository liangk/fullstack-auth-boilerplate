import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ChangePasswordRequest } from '../models/auth';
import { MaterialModule } from '../material.module';
import { FieldDto, LiteSnackbarService } from 'ngx-lite-form';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  template: `
    <div class="profile_content">
      <div class="title2">Change Password</div>
      <form [formGroup]="changePasswordForm" (ngSubmit)="onSubmit()" novalidate>
        <lite-input [control]="currentPassword"></lite-input>
        <lite-input [control]="newPassword"></lite-input>
        <lite-input [control]="confirmPassword"></lite-input>
        <div class="actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="changePasswordForm.invalid || loading">
            <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
            <span *ngIf="!loading">Change Password</span>
          </button>
          <button mat-button type="button" (click)="goBack()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './pages.scss'
})
export class ChangePasswordPage implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snack = inject(LiteSnackbarService);
  private router = inject(Router);

  changePasswordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: this.passwordMatchValidator });

  currentPassword: FieldDto = {
    label: 'Current Password',
    formControl: this.changePasswordForm.get('currentPassword') as FormControl
  };

  newPassword: FieldDto = {
    label: 'New Password',
    formControl: this.changePasswordForm.get('newPassword') as FormControl
  };

  confirmPassword: FieldDto = {
    label: 'Confirm New Password',
    formControl: this.changePasswordForm.get('confirmPassword') as FormControl
  };

  loading = false;

  ngOnInit() {}

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.hasError('passwordMismatch')) {
      const errors = { ...confirmPassword.errors };
      delete errors['passwordMismatch'];
      confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
    }
    return null;
  }

  async onSubmit() {
    if (this.changePasswordForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.changePasswordForm.value;

    const changePasswordData: ChangePasswordRequest = {
      currentPassword: formValue.currentPassword,
      newPassword: formValue.newPassword,
    };

    try {
      const response = await this.authService.changePassword(changePasswordData).toPromise();
      if (!response) {
        throw new Error('Failed to change password');
      }
      this.snack.show(response.message, 'done', 5000);
      this.router.navigate(['/profile']);
    } catch (error: any) {
      const message = error.error?.message || 'Failed to change password';
      this.snack.show(message, 'error', 5000);
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}
