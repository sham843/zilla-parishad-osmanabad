import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AgmCoreModule } from '@agm/core';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table'
import {MatSidenavModule} from '@angular/material/sidenav';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    MatSelectModule,
    MatCardModule,
    NgApexchartsModule,
    TranslateModule,
    MatTableModule,
    MatCheckboxModule,
    MatSidenavModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBhkYI4LMEqVhB6ejq12wpIA6CW5theKJw',
      language: 'en',
      libraries: ['places', 'geometry'],
    }),
  ]
})
export class DashboardModule { }
