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
import { SharedModule } from 'src/app/shared/shared.module';
import { SchoolRegistrationComponent } from './school-registration.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

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
    SharedModule,
    MatIconModule,
    ReactiveFormsModule
  ]
})
export class SchoolRegistrationModule { }
