import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, MatToolbarModule, MatButtonModule, AsyncPipe, NgIf],
  template: `
    <mat-toolbar color="primary">
      <a routerLink="/" mat-button>Home</a>
      <span class="spacer"></span>
      <ng-container *ngIf="(auth.isAuthenticated$ | async); else loggedOut">
        <button mat-raised-button color="accent" (click)="logout()">Logout</button>
      </ng-container>
      <ng-template #loggedOut>
        <a routerLink="/login" mat-button>Login</a>
        <a routerLink="/register" mat-button>Register</a>
      </ng-template>
    </mat-toolbar>
  `,
  styles: [`.spacer { flex: 1 1 auto; } a { text-decoration: none; color: inherit; }`]
})
export class NavbarComponent {
  auth = inject(AuthService);
  logout() { this.auth.logout().subscribe(); }
}
