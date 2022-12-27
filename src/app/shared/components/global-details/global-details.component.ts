import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StudentDetailsComponent } from 'src/app/modules/masters/student-registration/student-details/student-details.component';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-global-details',
  templateUrl: './global-details.component.html',
  styleUrls: ['./global-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    TableComponent,
    StudentDetailsComponent
  ]
})
export class GlobalDetailsComponent {

}
