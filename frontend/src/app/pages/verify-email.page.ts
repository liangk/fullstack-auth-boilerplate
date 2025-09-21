import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MaterialModule } from '../material.module';
import { LiteSnackbarService } from 'ngx-lite-form';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [MaterialModule, RouterLink],
  template: `
    <div class="register_content">
      <div class="title2">Verifying Email...</div>
      <p>{{ message }}</p>
      <div class="actions" *ngIf="verified">
        <button mat-raised-button color="primary" routerLink="/login">Continue to Login</button>
      </div>
    </div>
  `,
  styleUrl: './pages.scss'
})
export class VerifyEmailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private snack = inject(LiteSnackbarService);

  message = 'Verifying your email address...';
  verified = false;

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.message = 'Invalid verification link. No token provided.';
      return;
    }

    // Call backend verification endpoint
    this.auth.verifyEmail(token).subscribe({
      next: () => {
        this.message = 'Email verified successfully! You can now log in.';
        this.verified = true;
        this.snack.show('Email verified successfully', 'done', 3000);
      },
      error: (error) => {
        const errorMsg = error?.error?.message || 'Failed to verify email';
        this.message = `Verification failed: ${errorMsg}`;
        this.snack.show(errorMsg, 'error', 5000);
      }
    });
  }
}
