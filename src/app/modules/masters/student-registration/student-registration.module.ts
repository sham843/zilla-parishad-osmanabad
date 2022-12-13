import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRegistrationRoutingModule } from './student-registration-routing.module';
import { AddUpdateStudentRegistrationComponent } from './add-update-student-registration/add-update-student-registration.component';


@NgModule({
  declarations: [
    AddUpdateStudentRegistrationComponent
  ],
  imports: [
    CommonModule,
    StudentRegistrationRoutingModule
  ]
})
export class StudentRegistrationModule { }
