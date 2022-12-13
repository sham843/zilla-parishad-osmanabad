import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherRegistrationRoutingModule } from './teacher-registration-routing.module';
import { AddUpdateTeacherRegistrationComponent } from './add-update-teacher-registration/add-update-teacher-registration.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AddUpdateTeacherRegistrationComponent
  ],
  imports: [
    CommonModule,
    TeacherRegistrationRoutingModule,
    MatDialogModule,
    SharedModule

    ]
})
export class TeacherRegistrationModule { }
