import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateTeacherRegistrationComponent } from './add-update-teacher-registration/add-update-teacher-registration.component';

@Component({
  selector: 'app-teacher-registration',
  templateUrl: './teacher-registration.component.html',
  styleUrls: ['./teacher-registration.component.scss']
})
export class TeacherRegistrationComponent {
  toggleControl = new FormControl(false);
  @HostBinding('class') className = '';
  constructor(private dialog: MatDialog,private overlay:OverlayContainer) {
  }

  ngOnInit(): void {
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      const darkClassName = 'darkMode';
      this.className = darkMode ? darkClassName : '';
      if (darkMode) {
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });
}
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
    this.dialog.open(AddUpdateTeacherRegistrationComponent, {
      width: '820px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }
}
