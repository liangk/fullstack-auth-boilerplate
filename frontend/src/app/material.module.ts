import { NgModule } from '@angular/core';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { LiteFormModule } from 'ngx-lite-form';

const MaterialModules = [
  CommonModule,
  MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule,
  MatFormFieldModule, MatInputModule,
  MatSnackBarModule, LiteFormModule
];

@NgModule({
  imports: MaterialModules,
  exports: MaterialModules,
})
export class MaterialModule {}
