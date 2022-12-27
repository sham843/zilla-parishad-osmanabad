import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherRegistrationRoutingModule } from './teacher-registration-routing.module';
import { AddUpdateTeacherRegistrationComponent } from './add-update-teacher-registration/add-update-teacher-registration.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { TeacherRegistrationComponent } from './teacher-registration.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { PageStatisticsComponent } from 'src/app/shared/components/page-statistics/page-statistics.component';
import { AutofocusDirective } from 'src/app/core/directives/autofocus.directive';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AddUpdateTeacherRegistrationComponent,
    TeacherRegistrationComponent
  ],
  imports: [
    CommonModule,
    TeacherRegistrationRoutingModule,
    MatDialogModule,
    MatSelectModule,
    MatCardModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    GlobalDialogComponent,
    TableComponent,
    PageStatisticsComponent,
    AutofocusDirective,
    TranslateModule
  ]
})
export class TeacherRegistrationModule { }
