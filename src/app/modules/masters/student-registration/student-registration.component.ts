import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateStudentRegistrationComponent } from './add-update-student-registration/add-update-student-registration.component';

@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.scss']
})
export class StudentRegistrationComponent {
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
    this.dialog.open(AddUpdateStudentRegistrationComponent, {
      width:'900px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }
}
