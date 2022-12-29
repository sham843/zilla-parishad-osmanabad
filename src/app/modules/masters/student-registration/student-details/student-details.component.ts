import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    TranslateModule,
    MatIconModule
    
  ]
})
export class StudentDetailsComponent {
  imgPath!:string
  languageFlag!: string;
  @Input() data : any; // decorate the property with @Input()
  constructor(  
    private webService: WebStorageService,
    public dialogRef: MatDialogRef<StudentDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogdata: any) { }

    ngOnInit(){
      this.languageFlag = this.webService.languageFlag;
      if(this.dialogdata){
        this.data = this.dialogdata
      }
      this.imgPath = this.data.documentResponse[1]?.docPath;
       
    }

    viewImage(){
     
      window.open( this.imgPath , 'blank')
    }

}
