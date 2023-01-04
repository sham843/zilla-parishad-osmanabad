import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { Gallery,ImageItem,GalleryModule,} from '@ngx-gallery/core';
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
    MatButtonModule,
     LightboxModule,
     GalleryModule
  ]
})
export class GlobalDetailComponent {
  items: any=[];
  dataArray = new Array();
  // [
    // {
    //   docPath : '',
    //   // documentId : 3,
    //   // id : 283,
    //   // schoolId : 1863
    // }
    // {
      // docPath : '',
      // srcUrl: 'https://preview.ibb.co/jrsA6R/img12.jpg',
      // previewUrl: 'https://preview.ibb.co/jrsA6R/img12.jpg'
    // },
    // {
    //   srcUrl: 'https://preview.ibb.co/kPE1D6/clouds.jpg',
    //   previewUrl: 'https://preview.ibb.co/kPE1D6/clouds.jpg'
    // },
    // {
    //   srcUrl: 'https://preview.ibb.co/mwsA6R/img7.jpg',
    //   previewUrl: 'https://preview.ibb.co/mwsA6R/img7.jpg'
    // },
    // {
    //   srcUrl: 'https://preview.ibb.co/kZGsLm/img8.jpg',
    //   previewUrl: 'https://preview.ibb.co/kZGsLm/img8.jpg'
    // }
  // ]


  constructor( public gallery: Gallery,public dialogRef: MatDialogRef<GlobalDetailComponent>,@Inject(MAT_DIALOG_DATA) public data: any, public webStorage: WebStorageService){ 

   }

   ngOnInit() {
    console.log("Obj : ",this.data);

    this.dataArray = this.data.Obj.schoolDocument;
    
    this.items = this.dataArray?.map(item =>
      new ImageItem({ src: item.docPath, thumb: item.docPath })
    );
    
    this.basicLightboxExample();
   }

   basicLightboxExample() {
    this.gallery.ref().load(this.items);
  }

  closeDialog(){
    this.dialogRef.close();
  }

}
