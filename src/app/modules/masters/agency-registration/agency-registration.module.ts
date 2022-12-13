import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgencyRegistrationRoutingModule } from './agency-registration-routing.module';
import { AddUpdateAgencyRegistrationComponent } from './add-update-agency-registration/add-update-agency-registration.component';


@NgModule({
  declarations: [
    AddUpdateAgencyRegistrationComponent
  ],
  imports: [
    CommonModule,
    AgencyRegistrationRoutingModule
  ]
})
export class AgencyRegistrationModule { }
