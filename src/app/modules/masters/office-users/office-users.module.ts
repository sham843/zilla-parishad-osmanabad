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
    MatNativeDateModule
    
    


  ]
})
export class OfficeUsersModule { }
