import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateAgencyRegistrationComponent } from './add-update-agency-registration/add-update-agency-registration.component';

@Component({
  selector: 'app-agency-registration',
  templateUrl: './agency-registration.component.html',
  styleUrls: ['./agency-registration.component.scss']
})
export class AgencyRegistrationComponent {
  constructor(private dialog: MatDialog) { }

  addUpdateAgency() {
    let obj: any;
    this.dialog.open(AddUpdateAgencyRegistrationComponent, {
      width:'900px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }
}
