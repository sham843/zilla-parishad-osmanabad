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
    this.dialog.open(AddUpdateAgencyRegistrationComponent, {
      width:'900px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }
}
