import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-update-agency-registration',
  templateUrl: './add-update-agency-registration.component.html',
  styleUrls: ['./add-update-agency-registration.component.scss']
})
export class AddUpdateAgencyRegistrationComponent {
  
  constructor(public dialogRef: MatDialogRef<AddUpdateAgencyRegistrationComponent>) {}
}
