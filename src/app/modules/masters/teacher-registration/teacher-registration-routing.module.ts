import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherRegistrationComponent } from './teacher-registration.component';

const routes: Routes = [{path:'',component:TeacherRegistrationComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRegistrationRoutingModule { }
