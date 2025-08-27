import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card>
      <h1>Dashboard</h1>
      <p>You're logged in.</p>
    </mat-card>
  `,
  styles: [`mat-card { max-width: 600px; margin: 32px auto; }`]
})
export class DashboardPage {
  auth = inject(AuthService);
}
