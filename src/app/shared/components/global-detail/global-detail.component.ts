import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-global-detail',
  templateUrl: './global-detail.component.html',
  styleUrls: ['./global-detail.component.scss'],
  standalone : true,
  imports: [
    TranslateModule,
    MatCardModule,
    CommonModule
  ]
})
export class GlobalDetailComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){

  }

}
