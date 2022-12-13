import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateSchoolRegistrationComponent } from './add-update-school-registration/add-update-school-registration.component';

@Component({
  selector: 'app-school-registration',
  templateUrl: './school-registration.component.html',
  styleUrls: ['./school-registration.component.scss']
})
export class SchoolRegistrationComponent {
  constructor(private dialog: MatDialog) { }

  addUpdateAgency() {
    let obj: any;
    this.dialog.open(AddUpdateSchoolRegistrationComponent, {
      width:'320px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }
}
