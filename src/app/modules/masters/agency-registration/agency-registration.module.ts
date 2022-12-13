import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgencyRegistrationRoutingModule } from './agency-registration-routing.module';
import { AddUpdateAgencyRegistrationComponent } from './add-update-agency-registration/add-update-agency-registration.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AddUpdateAgencyRegistrationComponent
  ],
  imports: [
    CommonModule,
    AgencyRegistrationRoutingModule,
    MatDialogModule,
  ]
})
export class AgencyRegistrationModule { }
