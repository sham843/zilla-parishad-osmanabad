import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { MasterService } from 'src/app/core/services/master.service';

@Component({
  selector: 'app-add-update-school-registration',
  templateUrl: './add-update-school-registration.component.html',
  styleUrls: ['./add-update-school-registration.component.scss']
})
export class AddUpdateSchoolRegistrationComponent {
  districtArr = new Array();
  talukaArr = new Array();
  centerArr = new Array();
  groupclassArr = new Array();
  schoolTypeArr = new Array();
  villageArr = new Array();
  categoryArr = new Array();
  schoolMngArr = new Array();
  schoolRegForm !: FormGroup;
  uploadImg: any;
  editFlag: boolean = false;

  constructor(private masterService: MasterService, private errors: ErrorsService, private fb: FormBuilder, private fileUpload: FileUploadService,
    private apiService: ApiService, private commonMethod: CommonMethodsService, @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit() {
    this.formFeild();
    this.getDistrict();

    if (this.data) {
      this.onEdit();
    }
  }

  formFeild() {
    this.schoolRegForm = this.fb.group({
      "createdBy": 0,
      "modifiedBy": 0,
      "createdDate": new Date(),
      "modifiedDate": new Date(),
      "isDeleted": true,
      "id": 0,
      "schoolName": [''],
      "m_SchoolName": [''],
      "stateId": [''],
      "districtId": [''],
      "talukaId": [''],
      "villageId": [''],
      "centerId": [''],
      "s_CategoryId": [''],
      "s_ManagementId": [''],
      "s_TypeId": [''],
      "g_ClassId": [''],
      "uploadImage": [''],
      "lan": ['EN'],
      "schoolDocument": [
        {
          "createdBy": 0,
          "modifiedBy": 0,
          "createdDate": "2022-12-19T06:18:01.268Z",
          "modifiedDate": "2022-12-19T06:18:01.268Z",
          "isDeleted": true,
          "id": 0,
          "schoolId": 0,
          "documentId": 3,
          "docPath": "string"
        }
      ]
    })
  }

  getDistrict() {
    this.masterService.getAllDistrict('EN').subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.districtArr = res.responseData;
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getTaluka() {
    this.masterService.getAllTaluka('1').subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.talukaArr = res.responseData;
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getCenter() {
    this.masterService.getAllCenter('EN').subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.centerArr = res.responseData;
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getGroupClass() {
    this.masterService.getAllGroupClass('EN').subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.groupclassArr = res.responseData;
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getSchoolType() {
    this.masterService.getAllSchoolType('EN').subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.schoolTypeArr = res.responseData;
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getVillage() {
    this.masterService.getAllVillage('EN', this.schoolRegForm.value.villageId).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.villageArr = res.responseData;
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getCategoryDes() {
    this.masterService.GetSchoolCategoryDescById('EN').subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.categoryArr = res.responseData;
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getSchoolMngDesc() {
    this.masterService.GetSchoolMngDescById('EN').subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.schoolMngArr = res.responseData;
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  imgUpload(event: any) {
    this.fileUpload.uploadDocuments(event, 'Upload', 'jpg, jpeg, png').subscribe((res: any) => {
      this.uploadImg = res.responseData;
    });
  }

  onSubmit() {
    let formValue = this.schoolRegForm.value;
    formValue.image = this.uploadImg;

    this.apiService.setHttp('post', 'ZP-Osmanabad/School/Add', false, formValue, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        // console.log("Post res : ", res);
        if (res.statusCode == "200") {
          this.commonMethod.snackBar("Record Added Successfully", 0)
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  onEdit() {
    this.editFlag = true;
    this.schoolRegForm.patchValue({
      "createdBy": 0,
      "modifiedBy": 0,
      "createdDate": new Date(),
      "modifiedDate": new Date(),
      "isDeleted": false,
      "id": this.data.id,
      "schoolName": this.data.schoolName,
      "m_SchoolName": [''],
      "stateId": 0,
      "districtId": this.data.districtId,
      "talukaId": this.data.talukaId,
      "villageId": 0,
      "centerId": this.data.centerId,
      "s_CategoryId": 0,
      "s_ManagementId": 0,
      "s_TypeId": 0,
      "g_ClassId": this.data.g_ClassId,
      // "image" : [''],
      "lan": ['EN']
    })
  }





}
