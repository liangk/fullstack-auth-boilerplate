import { Component, inject } from '@angular/core';
import { MaterialModule } from '../material.module';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MaterialModule],
  template: `
    <div class="dashboard_content">
      <div class="title2">Dashboard</div>
      <p>You're logged in.</p>
    </div>
  `,
  styleUrl: './pages.scss'
})
export class DashboardPage {
  auth = inject(AuthService);
}
