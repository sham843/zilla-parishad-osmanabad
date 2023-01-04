import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public.component';

const routes: Routes = [
  { path: '', component: PublicComponent },
  { path: 'home', loadChildren: () => import('../../modules/home/home.module').then(m => m.HomeModule) },
  { path: 'login', loadChildren: () => import('../../modules/login/login.module').then(m => m.LoginModule), data: { breadcrumb: [{ title: 'Login', active: true }] } },
  { path: 'forgot-password', loadChildren: () => import('../../modules/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule), data: { breadcrumb: [{ title: 'forgot-password', active: true }] } },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
