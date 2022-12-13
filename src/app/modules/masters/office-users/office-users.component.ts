import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateOfficeUsersComponent } from './add-update-office-users/add-update-office-users.component';

@Component({
  selector: 'app-office-users',
  templateUrl: './office-users.component.html',
  styleUrls: ['./office-users.component.scss']
})
export class OfficeUsersComponent {
  constructor(private dialog: MatDialog) { }

  addUpdateAgency() {
    let obj: any;
    this.dialog.open(AddUpdateOfficeUsersComponent, {
      width:'320px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }
}
