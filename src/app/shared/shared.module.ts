import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashPipe } from './pipes/dash.pipe';
import { TableComponent } from './components/table/table.component';



@NgModule({
  declarations: [
    DashPipe,
    TableComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [TableComponent]
})
export class SharedModule { }
