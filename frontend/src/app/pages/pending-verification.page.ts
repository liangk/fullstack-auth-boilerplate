import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MaterialModule } from '../material.module';
import { LiteSnackbarService } from 'ngx-lite-form';

@Component({
  selector: 'app-pending-verification',
  standalone: true,
  imports: [MaterialModule, RouterLink],
  template: `
    <div class="register_content">
      <div class="title2">Verify Your Email</div>
      <p>We've sent a verification email to <strong>{{ email }}</strong></p>
      <p>Please check your email and click the verification link to activate your account.</p>
      
      <div class="actions">
        <button mat-raised-button color="primary" (click)="resendVerification()" [disabled]="loading">
          {{ loading ? 'Sending...' : 'Resend Verification Email' }}
        </button>
        <button mat-button routerLink="/login">Back to Login</button>
      </div>
    </div>
  `,
  styleUrl: './pages.scss'
})
export class PendingVerificationPage implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snack = inject(LiteSnackbarService);

  email = '';
  loading = false;

  ngOnInit() {
    // Get email from query params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  resendVerification() {
    if (!this.email) return;
    this.loading = true;
    this.auth.resendVerification(this.email).subscribe({
      next: () => {
        this.snack.show('Verification email sent', 'done', 2500);
      },
      error: (e) => {
        const msg = e?.error?.message || 'Failed to resend email';
        this.snack.show(msg, 'error', 3500);
      }
    }).add(() => this.loading = false);
  }
}
