import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeUsersRoutingModule } from './office-users-routing.module';
import { AddUpdateOfficeUsersComponent } from './add-update-office-users/add-update-office-users.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OfficeUsersComponent } from './office-users.component';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { PageStatisticsComponent } from 'src/app/shared/components/page-statistics/page-statistics.component';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { GridViewComponent } from 'src/app/shared/components/grid-view/grid-view.component';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    AddUpdateOfficeUsersComponent,
    OfficeUsersComponent
  ],
  imports: [
    CommonModule,
    OfficeUsersRoutingModule,
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
    GlobalDialogComponent,
    TableComponent,
    PageStatisticsComponent,
    TranslateModule,
    GridViewComponent,
    MatTooltipModule
  ]
})
export class OfficeUsersModule { }

