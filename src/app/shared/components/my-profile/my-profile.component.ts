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
import { MasterService } from 'src/app/core/services/master.service'
import { MatSelectModule } from '@angular/material/select';
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
    CommonModule,
    MatSelectModule
  ]
})
export class MyProfileComponent {
  userProfile !: FormGroup;
  uploadImg: string = "assets/images/user.jpg";
  imgFlag: boolean = false;
  userType: any;
  editObj: any
  designationData = new Array();
  @ViewChild('uploadImage') imageFile!: ElementRef;

  constructor(private api: ApiService, private error: ErrorsService, private fileUpl: FileUploadService, private masterService: MasterService,
    public webStorage: WebStorageService, private fb: FormBuilder, public dialogRef: MatDialogRef<AddUpdateAgencyRegistrationComponent>,
    private commonMethods: CommonMethodsService, public validation: ValidationService) { this.dialogRef.disableClose = true }

  ngOnInit() {
    this.getUserById();
    this.getUser();
    this.defaultForm();
    this.userType = this.webStorage.getLoggedInLocalstorageData();
  }

  getUserById() {
    this.api.setHttp('get', `zp_osmanabad/app-login/GetTeacherProfile?TeacherId=${this.webStorage.getUserId()}`, false, false, false, 'baseUrl');
    this.api.getHttp().subscribe({
      next: (res: any) => {
        res.statusCode == 200 ? this.defaultForm(res.responseData) : '';
      },
      error: (error: any) => {
        this.error.handelError(error.statusMessage)
      }
    })
  }

  getUserByAdmin() {
    this.api.setHttp('get', `zp_osmanabad/user-registration/GetAdminProfile?Id=${this.webStorage.getUserId()}`, false, false, false, 'baseUrl');
    this.api.getHttp().subscribe({
      next: (res: any) => {
        res.statusCode == 200 ? this.defaultForm(res.responseData) : '';
      },
      error: (error: any) => {
        this.error.handelError(error.statusMessage)
      }
    })

  }

  getUserByOffice() {
    this.api.setHttp('get', `zp_osmanabad/user-registration/GetOfficeProfileById?Id=${this.webStorage.getUserId()}`, false, false, false, 'baseUrl');
    this.api.getHttp().subscribe({
      next: (res: any) => {
        res.statusCode == 200 ? (this.defaultForm(res.responseData), this.editObj = res.responseData, this.getDesignation()) : '';
      },
      error: (error: any) => {
        this.error.handelError(error.statusMessage)
      }
    })
  }

  getUser() {
    let data = this.webStorage.getLoggedInLocalstorageData();
    data.userTypeId == 1 ? this.getUserByAdmin() : data.userTypeId == 2 ? this.getUserByOffice() : ""
  }

  getDesignation() {
    let lan = this.webStorage.getLangauge();
    this.masterService.GetDesignationByLevelId(lan, this.editObj.designationLevelId).subscribe({
      next: (res: any) => {
        this.designationData = res.responseData;
      }, error: (error: any) => {
        this.error.handelError(error.statusMessage)
      }
    });
  }

  defaultForm(data?: any) {
    this.userProfile = this.fb.group({
      "name": [data ? data?.name : ''],
      "mobileNo": [data ? data?.mobileNo : '', [Validators.required, Validators.pattern(this.validation.mobile_No)]],
      "emailId": [data ? data?.emailId : '', [Validators.required, Validators.pattern(this.validation.email)]],
      "profilePhoto": [data ? this.uploadImg = data?.profilePhoto : this.uploadImg],
      "designationLevelId": [data ? data?.designationLevelId : '']
    })
  }
  get fc() { return this.userProfile.controls }

  fileUpload(event: any) {
    this.imgFlag = true;
    this.fileUpl.uploadDocuments(event, 'Upload', 'jpg, jpeg, png').subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.uploadImg = res.responseData;
        this.fc['profilePhoto'].setValue(this.uploadImg);
        this.commonMethods.snackBar(res.statusMessage, 0);
      } else {
        this.uploadImg = "assets/images/user.jpg"
      }
    });
  }

  removeImg() {
    this.imageFile.nativeElement.value = '';
    this.uploadImg = "assets/images/user.jpg"
    this.fc['profilePhoto'].setValue(this.uploadImg);
  }

  onSubmit() {
    let obj = this.userProfile.value;
    let data = this.webStorage.getLoggedInLocalstorageData();
    let lan = this.webStorage.getLangauge();
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

    let obj1 = {
      "id": data.id,
      "refId": data.refId,
      "name": obj.name,
      "m_Name": "",
      "mobileNo": obj.mobileNo,
      "emailId": obj.emailId,
      "designationId": this.editObj.designationId,
      "profilePhoto": obj.profilePhoto,
      "modifiedBy": 0,
      "modifiedDate": new Date(),
      "lan": lan
    }

    if (this.userProfile.valid) {
      this.api.setHttp('put', 'zp_osmanabad/user-registration/' + (data.userTypeId == '1' ? 'UpdateProfile' : 'UpdateOfficerProfile'), false, data.userTypeId == 1 ? uploadData : obj1, false, 'baseUrl');
      this.api.getHttp().subscribe({
        next: (res: any) => {
          res.statusCode == 200 ? (this.commonMethods.snackBar(res.statusMessage, 0), this.dialogRef.close()) : this.commonMethods.snackBar(res.statusMessage, 1);
        },
        error: (error: any) => {
          this.error.handelError(error.statusMessage)
        }
      })
    }
    else {
      this.commonMethods.snackBar(this.webStorage.languageFlag == 'EN' ? 'Please Enter Mandatory Fields' : 'कृपया अनिवार्य फील्ड प्रविष्ट करा', 1);
      return;
    }
  }
}
