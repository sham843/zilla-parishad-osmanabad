import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignationMasterRoutingModule } from './designation-master-routing.module';
import { DesignationMasterComponent } from './designation-master.component';
import { AddUpdateDesignationMasterComponent } from './add-update-designation-master/add-update-designation-master.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    DesignationMasterComponent,
    AddUpdateDesignationMasterComponent
  ],
  imports: [
    CommonModule,
    DesignationMasterRoutingModule,
    MatDialogModule,
    SharedModule,
    MatSelectModule,
    MatCardModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatMenuModule,
    MatButtonModule
    
  ]
})
export class DesignationMasterModule { }
