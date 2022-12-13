import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateDesignationMasterComponent } from './add-update-designation-master/add-update-designation-master.component';

@Component({
  selector: 'app-designation-master',
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.scss']
})
export class DesignationMasterComponent {
  constructor(private dialog: MatDialog) { }

  addUpdateAgency() {
    let obj: any;
    this.dialog.open(AddUpdateDesignationMasterComponent, {
      width:'320px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }
}
