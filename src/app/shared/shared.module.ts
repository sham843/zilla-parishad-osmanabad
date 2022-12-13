import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashPipe } from './pipes/dash.pipe';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    DashPipe
  ],
  imports: [
    CommonModule,
    MatSlideToggleModule
  ]
})
export class SharedModule { }
