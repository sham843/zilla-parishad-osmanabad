import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashPipe } from './pipes/dash.pipe';
import { TableComponent } from './components/table/table.component';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    DashPipe,
    TableComponent
  ],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatTableModule
  ],
  exports: [TableComponent]
})
export class SharedModule { }
