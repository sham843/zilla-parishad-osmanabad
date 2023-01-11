import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { Gallery, ImageItem, GalleryModule, } from '@ngx-gallery/core';
import { progressChartLineComponent } from '../../progressChartLine/progressChartLine.component';
@Component({
  selector: 'app-global-detail',
  templateUrl: './global-detail.component.html',
  styleUrls: ['./global-detail.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    MatCardModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    LightboxModule,
    GalleryModule,
    progressChartLineComponent,

  ]
})
export class GlobalDetailComponent {
  items: any = [];
  dataArray = new Array();
  objData:any;

  constructor(private webService: WebStorageService,
    public gallery: Gallery, public dialogRef: MatDialogRef<GlobalDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public webStorage: WebStorageService) {

  }

  ngOnInit() {
    this.dataArray = this.data.Obj.schoolDocument;

    this.items = this.dataArray?.map(item =>
      new ImageItem({ src: item.docPath, thumb: item.docPath })
    );

    this.basicLightboxExample();
    this.getLineChartDetails(this.data);
  }

  basicLightboxExample() {
    this.gallery.ref().load(this.items);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getLineChartDetails(obj: any) {
    let groupId = obj.Obj.standardId <= 2 ? 1 : obj.Obj.standardId <= 5 ? 2 : 3;
    obj.studentId = obj.Obj.id
    this.objData = {
      objData: obj,
      groupId: groupId || 1,
      selectedSubject:this.webStorage.languageFlag == 'EN'?'All' :'सर्व'
    }
    this.webService.selectedLineChartObj.next(this.objData);
  }
}
