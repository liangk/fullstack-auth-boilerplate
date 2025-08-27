import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from './components/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`.container { padding: 16px; }`]
})
export class AppComponent {}
