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

  childCompInfo(_obj: any) {
    // switch (obj.label) {
    //   case 'Pagination':
    //     this.pageNumber = obj.pageNumber;
    //     this.getTableData();
    //     break;
    //   case 'Edit' || 'Delete':
    //     this.addUpdateAgency(obj);
    //     break;
    //   case 'Block':
    //     this.globalDialogOpen();
    //     break;
    // }
  }
  
  addUpdateAgency() {
    let obj: any;
    this.dialog.open(AddUpdateOfficeUsersComponent, {
      width:'900px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }
}
