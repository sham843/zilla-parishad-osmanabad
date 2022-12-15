import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignationMasterRoutingModule } from './designation-master-routing.module';
import { DesignationMasterComponent } from './designation-master.component';
import { AddUpdateDesignationMasterComponent } from './add-update-designation-master/add-update-designation-master.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignationMasterService } from './designation-master.service';

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
  ],
  providers:[DesignationMasterService]
})
export class DesignationMasterModule { }
