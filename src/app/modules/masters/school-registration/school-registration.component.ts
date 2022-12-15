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
    this.dialog.open(AddUpdateSchoolRegistrationComponent, {
      width:'820px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }
}
