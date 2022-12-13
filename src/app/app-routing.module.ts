import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [{ path: 'home', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule), data: { breadcrumb: [{ title: 'Home', active: true }] } }, 
{ path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule), data: { breadcrumb: [{ title: 'Login', active: true }] } },
{ path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard], data: { breadcrumb: [{ title: 'Dashboard', active: true }]}},
{ path: 'designation-master', loadChildren: () => import('./modules/masters/designation-master/designation-master.module').then(m => m.DesignationMasterModule), canActivate: [AuthGuard], data: { breadcrumb: [{ title: 'Designation Master', active: true }]}},
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
