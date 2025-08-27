import { Routes } from '@angular/router';
import { LoginPage } from './pages/login.page';
import { RegisterPage } from './pages/register.page';
import { DashboardPage } from './pages/dashboard.page';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: DashboardPage, canActivate: [authGuard] },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: '**', redirectTo: '' }
];
