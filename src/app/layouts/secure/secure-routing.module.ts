import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecureComponent } from './secure.component';

const routes: Routes = [
  { path: '', component: SecureComponent },
  { path: 'dashboard', loadChildren: () => import('../../modules/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [], data: { breadcrumb: [{ title: 'Dashboard', m_title: 'डॅशबोर्ड', active: true }] } },
  { path: 'designation-master', loadChildren: () => import('../../modules/masters/designation-master/designation-master.module').then(m => m.DesignationMasterModule), data: { breadcrumb: [{ title: 'Register Designation', m_title: 'पदनाम नोंदणी', active: true }] } },
  { path: 'agency-registration', loadChildren: () => import('../../modules/masters/agency-registration/agency-registration.module').then(m => m.AgencyRegistrationModule), data: { breadcrumb: [{ title: 'Agency Registration', m_title: 'एजन्सी नोंदणी ', active: true }] } },
  { path: 'school-registration', loadChildren: () => import('../../modules/masters/school-registration/school-registration.module').then(m => m.SchoolRegistrationModule), data: { breadcrumb: [{ title: 'School Registration', m_title: 'शाळा नोंदणी', active: true }] } },
  { path: 'student-registration', loadChildren: () => import('../../modules/masters/student-registration/student-registration.module').then(m => m.StudentRegistrationModule), data: { breadcrumb: [{ title: 'Student Registration',m_title: 'विद्यार्थी नोंदणी', active: true }] } },
  // { path: 'student-details', loadChildren: () => import('../../modules/masters/student-registration/student-details/student-details.module').then(m => m.StudentDetailsModule) },
  { path: 'teacher-registration', loadChildren: () => import('../../modules/masters/teacher-registration/teacher-registration.module').then(m => m.TeacherRegistrationModule), data: { breadcrumb: [{ title: 'Teacher Registration',m_title: 'शिक्षक नोंदणी', active: true }] } },
  { path: 'office-users', loadChildren: () => import('../../modules/masters/office-users/office-users.module').then(m => m.OfficeUsersModule), data: { breadcrumb: [{ title: 'Office Users',m_title: 'ऑफिस युजर', active: true }] } },
  { path: 'page-right-access', loadChildren: () => import('../../modules/settings/page-right-access/page-right-access.module').then(m => m.PageRightAccessModule), data: { breadcrumb: [{ title: 'Page Right Access',m_title: 'पृष्ठ अधिकार', active: true }] } },
  { path: 'dashboard-student-details', loadChildren: () => import('../../modules/dashboard/dashboard-student-details/dashboard-student-details.module').then(m => m.DashboardStudentDetailsModule), data: { breadcrumb: [{ title: 'Dashboard Student Details',m_title: 'डॅशबोर्ड विद्यार्थी तपशील', active: true }] }  }
]
  

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class SecureRoutingModule { }
