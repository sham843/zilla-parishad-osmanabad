import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ErrorComponent } from './error.component';
import { ErrorRoutingModule } from './error-routing.module';


@NgModule({
  declarations: [
    ErrorComponent
  ],
  imports: [
    CommonModule,
    ErrorRoutingModule,
    MatIconModule
  ]
})
export class ErrorModule { }
