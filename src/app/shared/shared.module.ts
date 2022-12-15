import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashPipe } from './pipes/dash.pipe';
import { TableComponent } from './components/table/table.component';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [
    DashPipe,
    TableComponent
  ],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatTableModule, 
    FormsModule,
    MatButtonModule,
    MatPaginatorModule
  ],
  exports: [TableComponent]
})
export class SharedModule { }
