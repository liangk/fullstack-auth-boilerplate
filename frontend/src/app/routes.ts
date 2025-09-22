import { Routes } from '@angular/router';
import { LoginPage } from './pages/login.page';
import { RegisterPage } from './pages/register.page';
import { DashboardPage } from './pages/dashboard.page';
import { PendingVerificationPage } from './pages/pending-verification.page';
import { VerifyEmailPage } from './pages/verify-email.page';
import { ForgotPasswordPage } from './pages/forgot-password.page';
import { ResetPasswordPage } from './pages/reset-password.page';
import { ProfilePage } from './pages/profile.page';
import { ChangePasswordPage } from './pages/change-password.page';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: DashboardPage, canActivate: [authGuard] },
  { path: 'profile', component: ProfilePage, canActivate: [authGuard] },
  { path: 'change-password', component: ChangePasswordPage, canActivate: [authGuard] },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'pending-verification', component: PendingVerificationPage },
  { path: 'verify-email', component: VerifyEmailPage },
  { path: 'forgot-password', component: ForgotPasswordPage },
  { path: 'reset-password', component: ResetPasswordPage },
  { path: '**', redirectTo: '' }
];
