import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRegistrationRoutingModule } from './school-registration-routing.module';
import { AddUpdateSchoolRegistrationComponent } from './add-update-school-registration/add-update-school-registration.component';


@NgModule({
  declarations: [
    AddUpdateSchoolRegistrationComponent
  ],
  imports: [
    CommonModule,
    SchoolRegistrationRoutingModule
  ]
})
export class SchoolRegistrationModule { }
