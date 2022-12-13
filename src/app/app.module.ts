import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SchoolRegistrationComponent } from './modules/masters/school-registration/school-registration.component';
import { TeacherRegistrationComponent } from './modules/masters/teacher-registration/teacher-registration.component';
import { StudentRegistrationComponent } from './modules/masters/student-registration/student-registration.component';
import { OfficeUsersComponent } from './modules/masters/office-users/office-users.component';
import { AgencyRegistrationComponent } from './modules/masters/agency-registration/agency-registration.component';

@NgModule({
  declarations: [
    AppComponent,
    SchoolRegistrationComponent,
    TeacherRegistrationComponent,
    StudentRegistrationComponent,
    OfficeUsersComponent,
    AgencyRegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
