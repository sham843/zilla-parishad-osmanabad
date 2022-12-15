import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRegistrationRoutingModule } from './student-registration-routing.module';
import { AddUpdateStudentRegistrationComponent } from './add-update-student-registration/add-update-student-registration.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { StudentRegistrationComponent } from './student-registration.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [
    AddUpdateStudentRegistrationComponent,
    StudentRegistrationComponent
  ],
  imports: [
    CommonModule,
    StudentRegistrationRoutingModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ]
})
export class StudentRegistrationModule { }
