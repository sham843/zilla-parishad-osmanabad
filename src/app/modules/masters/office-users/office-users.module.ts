import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeUsersRoutingModule } from './office-users-routing.module';
import { AddUpdateOfficeUsersComponent } from './add-update-office-users/add-update-office-users.component';


@NgModule({
  declarations: [
    AddUpdateOfficeUsersComponent
  ],
  imports: [
    CommonModule,
    OfficeUsersRoutingModule
  ]
})
export class OfficeUsersModule { }
