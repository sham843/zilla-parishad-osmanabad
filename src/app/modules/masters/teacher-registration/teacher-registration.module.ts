import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRegistrationRoutingModule } from './teacher-registration-routing.module';
import { AddUpdateTeacherRegistrationComponent } from './add-update-teacher-registration/add-update-teacher-registration.component';


@NgModule({
  declarations: [
    AddUpdateTeacherRegistrationComponent
  ],
  imports: [
    CommonModule,
    TeacherRegistrationRoutingModule
  ]
})
export class TeacherRegistrationModule { }
