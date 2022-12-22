import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRegistrationRoutingModule } from './school-registration-routing.module';
import { AddUpdateSchoolRegistrationComponent } from './add-update-school-registration/add-update-school-registration.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { SchoolRegistrationComponent } from './school-registration.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { PageStatisticsComponent } from 'src/app/shared/components/page-statistics/page-statistics.component';
import { GlobalImgComponent } from 'src/app/shared/components/global-img/global-img.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    AddUpdateSchoolRegistrationComponent,
    SchoolRegistrationComponent
  ],
  imports: [
    CommonModule,
    SchoolRegistrationRoutingModule,
    MatDialogModule,
    MatSelectModule,
    MatCardModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    GlobalDialogComponent,
    TableComponent,
    PageStatisticsComponent,
    GlobalImgComponent,
    TranslateModule
]
})
export class SchoolRegistrationModule { }
