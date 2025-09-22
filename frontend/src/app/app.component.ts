import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar.component';
import { MaterialModule } from './material.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, MaterialModule],
  template: `
    <app-navbar></app-navbar>
    <main class="main_content">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}
