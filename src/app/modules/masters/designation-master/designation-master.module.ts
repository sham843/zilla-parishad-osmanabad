import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignationMasterRoutingModule } from './designation-master-routing.module';
import { DesignationMasterComponent } from './designation-master.component';
import { AddUpdateDesignationMasterComponent } from './add-update-designation-master/add-update-designation-master.component';


@NgModule({
  declarations: [
    DesignationMasterComponent,
    AddUpdateDesignationMasterComponent
  ],
  imports: [
    CommonModule,
    DesignationMasterRoutingModule
  ]
})
export class DesignationMasterModule { }
