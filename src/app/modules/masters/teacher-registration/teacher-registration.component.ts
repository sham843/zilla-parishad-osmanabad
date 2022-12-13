import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
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
