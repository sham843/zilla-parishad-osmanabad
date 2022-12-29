import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-global-detail',
  templateUrl: './global-detail.component.html',
  styleUrls: ['./global-detail.component.scss'],
  standalone : true,
  imports: [
    TranslateModule,
    MatCardModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class GlobalDetailComponent {
  
  constructor(public dialogRef: MatDialogRef<GlobalDetailComponent>,@Inject(MAT_DIALOG_DATA) public data: any){  }

  closeDialog(){
    this.dialogRef.close();
  }

}
