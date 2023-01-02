import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecureComponent } from './secure.component';

const routes: Routes = [
  { path: '', component: SecureComponent },
  { path: 'dashboard', loadChildren: () => import('../../modules/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [], data: { breadcrumb: [{ title: 'Dashboard', active: true }] } },
  { path: 'designation-master', loadChildren: () => import('../../modules/masters/designation-master/designation-master.module').then(m => m.DesignationMasterModule), data: { breadcrumb: [{ title: 'Register Designation', active: true }] } },
  { path: 'agency-registration', loadChildren: () => import('../../modules/masters/agency-registration/agency-registration.module').then(m => m.AgencyRegistrationModule), data: { breadcrumb: [{ title: 'Agency Registration', active: true }] } },
  { path: 'school-registration', loadChildren: () => import('../../modules/masters/school-registration/school-registration.module').then(m => m.SchoolRegistrationModule), data: { breadcrumb: [{ title: 'School Registration', active: true }] } },
  { path: 'student-registration', loadChildren: () => import('../../modules/masters/student-registration/student-registration.module').then(m => m.StudentRegistrationModule), data: { breadcrumb: [{ title: 'Student Registration', active: true }] } },
  // { path: 'student-details', loadChildren: () => import('../../modules/masters/student-registration/student-details/student-details.module').then(m => m.StudentDetailsModule) },
  { path: 'teacher-registration', loadChildren: () => import('../../modules/masters/teacher-registration/teacher-registration.module').then(m => m.TeacherRegistrationModule), data: { breadcrumb: [{ title: 'Teacher Registration', active: true }] } },
  { path: 'office-users', loadChildren: () => import('../../modules/masters/office-users/office-users.module').then(m => m.OfficeUsersModule), data: { breadcrumb: [{ title: 'Office Users', active: true }] } },
  { path: 'page-right-access', loadChildren: () => import('../../modules/settings/page-right-access/page-right-access.module').then(m => m.PageRightAccessModule), data: { breadcrumb: [{ title: 'Page Right Access', active: true }] } },
  { path: 'global-details', loadChildren: () => import('../../modules/dashboard/dashboard-student-details/dashboard-student-details.module').then(m => m.DashboardStudentDetailsModule), data: { breadcrumb: [{ title: 'Dashboard Student Details', active: true }] }  }
]
  

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class SecureRoutingModule { }
