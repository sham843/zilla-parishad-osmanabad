import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencyRegistrationRoutingModule } from './agency-registration-routing.module';
import { AddUpdateAgencyRegistrationComponent } from './add-update-agency-registration/add-update-agency-registration.component';
import { MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AgencyRegistrationComponent } from './agency-registration.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddUpdateAgencyRegistrationComponent,
    AgencyRegistrationComponent
  ],
  imports: [
    CommonModule,
    AgencyRegistrationRoutingModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
   SharedModule,
   MatIconModule,
   MatMenuModule,
   ReactiveFormsModule,
  ]
})
export class AgencyRegistrationModule { }
