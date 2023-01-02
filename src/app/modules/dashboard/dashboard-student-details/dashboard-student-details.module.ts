import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table'
import { DashboardStudentDetailsComponent } from './dashboard-student-details.component';
import { DashboardStudentDetailsRoutingModule } from './dashboard-student-details-routing';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    DashboardStudentDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardStudentDetailsRoutingModule,
    MatSelectModule,
    MatCardModule,
    NgApexchartsModule,
    TranslateModule,
    MatTableModule,
    MatCheckboxModule,
    TableComponent,
    MatFormFieldModule,
    MatInputModule ,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBhkYI4LMEqVhB6ejq12wpIA6CW5theKJw',
      language: 'en',
      libraries: ['places', 'geometry'],
    }),
  ]
})
export class DashboardStudentDetailsModule { }
