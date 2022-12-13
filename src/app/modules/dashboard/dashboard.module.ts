import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBhkYI4LMEqVhB6ejq12wpIA6CW5theKJw',
      language: 'en',
      libraries: ['places', 'geometry'],
    }),
  ]
})
export class DashboardModule { }
