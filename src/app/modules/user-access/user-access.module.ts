import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAccessRoutingModule } from './user-access-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { AddUpdateUserAccessComponent } from './add-update-user-access/add-update-user-access.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    AddUpdateUserAccessComponent
  ],
  imports: [
    CommonModule,
    UserAccessRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ]
})
export class UserAccessModule { }
