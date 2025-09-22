import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, MatToolbarModule, MatButtonModule, AsyncPipe ],
  template: `
    <header>
      <div class="home" routerLink="/">Home</div>
      @if (auth.isAuthenticated$ | async) {
        <div class="actions">
          <button mat-button routerLink="/profile">Profile</button>
          <button mat-raised-button color="accent" (click)="logout()">Logout</button>
        </div>
      } @else {
        <div class="actions">
          <button mat-raised-button color="accent" routerLink="/login">Login</button>
          <button mat-raised-button color="accent" routerLink="/register">Register</button>
        </div>
      }
    </header>
  `,
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  auth = inject(AuthService);
  logout() { this.auth.logout(); }
}
