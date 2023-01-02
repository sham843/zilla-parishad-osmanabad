import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardStudentDetailsComponent } from './dashboard-student-details.component';

const routes: Routes = [{ path: '', component: DashboardStudentDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardStudentDetailsRoutingModule { }