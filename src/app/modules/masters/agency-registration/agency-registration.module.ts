import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencyRegistrationRoutingModule } from './agency-registration-routing.module';
import { AddUpdateAgencyRegistrationComponent } from './add-update-agency-registration/add-update-agency-registration.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AgencyRegistrationComponent } from './agency-registration.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { PageStatisticsComponent } from 'src/app/shared/components/page-statistics/page-statistics.component';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { AutofocusDirective } from 'src/app/core/directives/autofocus.directive';


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
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule,
    TableComponent,
    PageStatisticsComponent,
    GlobalDialogComponent,
    TranslateModule,
    AutofocusDirective
  ]
})
export class AgencyRegistrationModule { }
