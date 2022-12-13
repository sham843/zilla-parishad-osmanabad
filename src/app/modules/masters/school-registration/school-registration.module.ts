import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRegistrationRoutingModule } from './school-registration-routing.module';
import { AddUpdateSchoolRegistrationComponent } from './add-update-school-registration/add-update-school-registration.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AddUpdateSchoolRegistrationComponent
  ],
  imports: [
    CommonModule,
    SchoolRegistrationRoutingModule,
    MatDialogModule
  ]
})
export class SchoolRegistrationModule { }
