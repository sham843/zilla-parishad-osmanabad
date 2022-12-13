import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficeUsersComponent } from './office-users.component';

const routes: Routes = [{path:'',component:OfficeUsersComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficeUsersRoutingModule { }
