import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashPipe } from './pipes/dash.pipe';



@NgModule({
  declarations: [
    DashPipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
