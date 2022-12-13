import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
{ path: '', redirectTo: 'home', pathMatch: 'full' },
{ path: 'home', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule), data: { breadcrumb: [{ title: 'Home', active: true }] } }, 
{ path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule), data: { breadcrumb: [{ title: 'Login', active: true }] } },
{ path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard], data: { breadcrumb: [{ title: 'Dashboard', active: true }]}},
{ path: 'designation-master', loadChildren: () => import('./modules/masters/designation-master/designation-master.module').then(m => m.DesignationMasterModule), canActivate: [AuthGuard], data: { breadcrumb: [{ title: 'Designation Master', active: true }]}},
{ path: 'agency-registration', loadChildren: () => import('./modules/masters/agency-registration/agency-registration.module').then(m => m.AgencyRegistrationModule), canActivate: [AuthGuard], data: { breadcrumb: [{ title: 'Agency Registration', active: true }]}},
{ path: 'school-registration', loadChildren: () => import('./modules/masters/school-registration/school-registration.module').then(m => m.SchoolRegistrationModule), canActivate: [AuthGuard], data: { breadcrumb: [{ title: 'School Registration', active: true }]}},
{ path: 'student-registration', loadChildren: () => import('./modules/masters/student-registration/student-registration.module').then(m => m.StudentRegistrationModule), canActivate: [AuthGuard], data: { breadcrumb: [{ title: 'Student Registration', active: true }]}},
{ path: 'teacher-registration', loadChildren: () => import('./modules/masters/teacher-registration/teacher-registration.module').then(m => m.TeacherRegistrationModule), canActivate: [AuthGuard], data: { breadcrumb: [{ title: 'Teacher Registration', active: true }]}},
{ path: 'office-users', loadChildren: () => import('./modules/masters/office-users/office-users.module').then(m => m.OfficeUsersModule), canActivate: [AuthGuard], data: { breadcrumb: [{ title: 'Office Users', active: true }]}},
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
