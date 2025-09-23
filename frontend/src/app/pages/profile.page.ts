import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserProfile } from '../models/auth';
import { MaterialModule } from '../material.module';
import { FieldDto, LiteSnackbarService } from 'ngx-lite-form';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  template: `
    <div class="profile_content">
    <div class="title2">Profile</div>
      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" novalidate>
        <lite-input [control]="name"></lite-input>
        <lite-input [control]="email"></lite-input>
        <div class="actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid || loading">Update</button>
          <button mat-button type="button" (click)="changePassword()">Change Password</button>
          <button mat-button type="button" (click)="goBack()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './pages.scss'
})
export class ProfilePage implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snack = inject(LiteSnackbarService);
  private router = inject(Router);

  profileForm = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
  });
  name: FieldDto = {label: 'Name', formControl: this.profileForm.get('name') as FormControl};
  email: FieldDto = {label: 'Email', formControl: this.profileForm.get('email') as FormControl};

  currentUser: UserProfile | null = null;
  loading = false;
  originalValues: any = {};

  ngOnInit() {
    this.loadProfile();
  }
  private async loadProfile() {
    this.authService.profile().subscribe({
      next: (response: UserProfile) => {
        this.currentUser = response;
        this.originalValues = {
          name: this.currentUser.name || '',
          email: this.currentUser.email
        };
        this.profileForm.patchValue({
          name: this.currentUser.name || '',
          email: this.currentUser.email
        });
      },
      error: (e) => {
        const msg = e?.error?.message || 'Failed to load profile';
        this.snack.show(msg, 'error', 8000);
      }
    });
  }

  hasChanges(): boolean {
    const formValue = this.profileForm.value;
    return formValue.name !== this.originalValues.name ||
           formValue.email !== this.originalValues.email;
  }

  async onSubmit() {
    if (this.profileForm.invalid || !this.hasChanges()) {
      return;
    }

    this.loading = true;

    try {
      const response = await this.authService.updateProfile(this.profileForm.value).toPromise();
      if (!response) {
        throw new Error('Failed to update profile');
      }
      this.snack.show(response.message, 'done', 5000);

      // Update current user data
      this.currentUser = response.user;
      this.originalValues = {
        name: this.currentUser?.name || '',
        email: this.currentUser?.email || ''
      };

      // If email verification is required, redirect to pending verification
      if (response.requiresVerification) {
        this.router.navigate(['/pending-verification']);
      }
    } catch (error: any) {
      const message = error.error?.message || 'Failed to update profile';
      this.snack.show(message, 'error', 5000);
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }
}
