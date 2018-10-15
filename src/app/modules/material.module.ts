import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatCardModule,
  MatDialogModule,
  MatSelectModule,
  MatMenuModule,
  MatDatepickerModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    MatMenuModule,
    MatDatepickerModule
  ],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    MatMenuModule,
    MatDatepickerModule
  ]
})
export class MaterialModule {}