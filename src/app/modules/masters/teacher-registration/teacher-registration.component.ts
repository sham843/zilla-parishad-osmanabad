import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddUpdateTeacherRegistrationComponent } from './add-update-teacher-registration/add-update-teacher-registration.component';

@Component({
  selector: 'app-teacher-registration',
  templateUrl: './teacher-registration.component.html',
  styleUrls: ['./teacher-registration.component.scss']
})
export class TeacherRegistrationComponent {
  constructor(private dialog: MatDialog,) {
  }

  addUpdateAgency() {
    let obj: any;
    this.dialog.open(AddUpdateTeacherRegistrationComponent, {
      width: '320px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }
}
