import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AddUpdateAgencyRegistrationComponent } from 'src/app/modules/masters/agency-registration/add-update-agency-registration/add-update-agency-registration.component';
import { ValidationService } from 'src/app/core/services/validation.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    TranslateModule,
    CommonModule
  ]
})
export class MyProfileComponent {
  userProfile !: FormGroup;
   uploadImg: string =  "";
  imgFlag : boolean = false;
  @ViewChild('uploadImage') imageFile!: ElementRef;

  constructor(private api: ApiService, private error: ErrorsService,private fileUpl: FileUploadService,
    private webStorage: WebStorageService, private fb: FormBuilder, public dialogRef: MatDialogRef<AddUpdateAgencyRegistrationComponent>,
    private commonMethods : CommonMethodsService, public validation : ValidationService) { this.dialogRef.disableClose = true}

  ngOnInit() {
    this.getUserById();
    this.defaultForm();
    
  }

  getUserById() {
    this.api.setHttp('get', `zp_osmanabad/app-login/GetTeacherProfile?TeacherId=${this.webStorage.getUserId()}`, false, false, false, 'baseUrl');
    this.api.getHttp().subscribe({
      next: (res: any) => {
        res.statusCode == 200 ? this.defaultForm(res.responseData)  : '';
      },
      error: (error: any) => {
        this.error.handelError(error.statusMessage)
      }
    })
  }

  defaultForm(data ? :any) {
    this.userProfile = this.fb.group({
      "name": [data?  data?.name :''],
      "mobileNo": [data ? data?.mobileNo :'',[Validators.required, Validators.pattern(this.validation.mobile_No)]],
      "emailId": [data ? data?.emailId :'', [Validators.required, Validators.pattern(this.validation.email)]],
      "profilePhoto": [data ? data?.profilePhoto : this.uploadImg],
    })
  data ? this.uploadImg = data.profilePhoto :  this.uploadImg  =  "assets/images/user.jpg"
  }
  get fc (){ return this.userProfile.controls}

  fileUpload(event: any) {
    this.imgFlag = true;
    this.fileUpl.uploadDocuments(event, 'Upload', 'jpg, jpeg, png').subscribe((res: any) => {
      if (res.statusCode == 200) {
          this.uploadImg = res.responseData;
          this.fc['profilePhoto'].setValue(this.uploadImg)
         
        this.commonMethods.snackBar(res.statusMessage, 0);
      } else {
         this.uploadImg = "assets/images/user.jpg"
      }
    });
  }

  removeImg(){
    this.imageFile.nativeElement.value = '';
    this.uploadImg = "assets/images/user.jpg"
  }

  onSubmit(){
    let obj = this.userProfile.value;
    let data = this.webStorage.getLoggedInLocalstorageData();
    let uploadData = {
      "id": data.id,
      "userTypeId": data.userTypeId,
      "subUserTypeId": data.subUserTypeId,
      "name": obj.name,
      "mobileNo": obj.mobileNo,
      "emailId": obj.emailId,
      "profilePhoto": obj.profilePhoto,
      "modifiedBy": 0,
      "modifiedDate": "2022-12-28T13:14:12.410Z"
    }
    this.api.setHttp('put', 'zp_osmanabad/app-login/UpdateProfile', false, uploadData, false, 'baseUrl');
    this.api.getHttp().subscribe({
      next: (res: any) => {
        res.statusCode == 200 ? (this.commonMethods.snackBar(res.statusMessage,0), this.dialogRef.close()  ): this.commonMethods.snackBar(res.statusMessage,1);
      },
      error: (error: any) => {
        this.error.handelError(error.statusMessage)
      }
    })
  }
}
