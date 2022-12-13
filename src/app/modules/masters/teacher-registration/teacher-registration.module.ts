import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherRegistrationRoutingModule } from './teacher-registration-routing.module';
import { AddUpdateTeacherRegistrationComponent } from './add-update-teacher-registration/add-update-teacher-registration.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AddUpdateTeacherRegistrationComponent
  ],
  imports: [
    CommonModule,
    TeacherRegistrationRoutingModule,
    MatDialogModule
    ]
})
export class TeacherRegistrationModule { }
