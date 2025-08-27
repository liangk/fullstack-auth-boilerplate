import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe } from '@angular/common';
import { NavbarComponent } from './components/navbar.component';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatProgressBarModule, AsyncPipe, NavbarComponent],
  template: `
    <mat-progress-bar *ngIf="isLoading$ | async" mode="indeterminate" color="accent" class="top-progress"></mat-progress-bar>
    <app-navbar></app-navbar>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `.container { padding: 16px; }`,
    `.top-progress { position: sticky; top: 0; left: 0; z-index: 1000; }`
  ]
})
export class AppComponent {
  private loading = inject(LoadingService);
  isLoading$ = this.loading.isLoading$;
}
