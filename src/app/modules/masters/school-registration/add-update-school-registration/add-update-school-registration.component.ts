import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';

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
  schoolDocument!: FormArray;

  constructor(private masterService: MasterService, private errors: ErrorsService, private fb: FormBuilder, private fileUpload: FileUploadService,
    private apiService: ApiService, private commonMethod: CommonMethodsService, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdateSchoolRegistrationComponent>, public validationService : ValidationService) { }

  ngOnInit() {
    this.formFeild();
    this.getDistrict();

    if (this.data) {
      this.onEdit();
    }
  }

  get f() {
    return this.schoolRegForm.controls;
  }

  formFeild() {
    this.schoolRegForm = this.fb.group({
      "createdBy": 0,
      "modifiedBy": 0,
      "createdDate": new Date(),
      "modifiedDate": new Date(),
      "isDeleted": false,
      "id": 0,
      "schoolName": ['', Validators.required],
      "m_SchoolName": "string",
      "stateId": 1,
      "districtId": ['', Validators.required],
      "talukaId": ['', Validators.required],
      "villageId": ['', Validators.required],
      "centerId": ['', Validators.required],
      "s_CategoryId": ['', Validators.required],
      "s_ManagementId": ['', Validators.required],
      "s_TypeId": ['', Validators.required],
      "g_ClassId": ['', Validators.required],
      "lan": "string",
      "localID": 0,
      "lowestClass": 0,
      "highestClass": 0,
      "timesStamp": new Date(),
      schoolDocument: this.fb.array([
        this.getGroup()
      ])
    });
  }
  getGroup(): FormGroup {
    return this.fb.group({
      "createdBy": 0,
      "modifiedBy": 0,
      "createdDate": new Date(),
      "modifiedDate": new Date(),
      "isDeleted": true,
      "id": 0,
      "schoolId": 0,
      "documentId": 3,
      "docPath": ['']
    })
  }

  get docForm(): FormArray {
    return this.schoolRegForm.get('schoolDocument') as FormArray;
  }

  getDistrict() {
    this.masterService.getAllDistrict('EN').subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.districtArr = res.responseData;
          if (this.editFlag == true) {
            this.f['districtId'].setValue(this.data.districtId);
            this.getTaluka();
          }
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
          if (this.editFlag == true) {
            this.f['talukaId'].setValue(this.data.talukaId);
            this.getCenter();
          }
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
          if (this.editFlag == true) {
            this.f['centerId'].setValue(this.data.centerId);
            this.getVillage();
          }
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getVillage() {
    this.masterService.getAllVillage('EN', this.schoolRegForm.value.talukaId).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.villageArr = res.responseData;
          if (this.editFlag == true) {
            this.f['villageId'].setValue(this.data.villageId);
            this.getSchoolType();
          }
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
          if (this.editFlag == true) {
            this.f['s_TypeId'].setValue(this.data.s_TypeId);
            this.getCategoryDes();
          }
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
          if (this.editFlag == true) {
            this.f['s_CategoryId'].setValue(this.data.s_CategoryId);
            this.getSchoolMngDesc();
          }
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
          if (this.editFlag == true) {
            this.f['s_ManagementId'].setValue(this.data.s_ManagementId);
            this.getGroupClass();
          }
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
          if (this.editFlag == true) {
            this.f['g_ClassId'].setValue(this.data.g_ClassId);
          }
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  imgUpload(event: any) {
    this.fileUpload.uploadDocuments(event, 'Upload', 'jpg, jpeg, png').subscribe((res: any) => {
      this.uploadImg = res.responseData;
      console.log("uploadImg", this.uploadImg);

    });
  }

  onSubmit() {
    let formValue = this.schoolRegForm.value;
    console.log("formValue : ", formValue);

    if (this.editFlag == false) {
    formValue.schoolDocument[0].docPath = this.uploadImg;

      this.apiService.setHttp('post', 'ZP-Osmanabad/School/Add', false, formValue, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode == "200") {
            this.commonMethod.snackBar("Record Added Successfully", 0);
            this.dialogRef.close('yes');
          }
        },
        error: ((err: any) => { this.errors.handelError(err) })
      });
    }
    else {
      formValue.schoolDocument[0].docPath = this.data.schoolDocument[0].docPath;

      this.apiService.setHttp('put', 'ZP-Osmanabad/School/Update', false, formValue, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode == "200") {
            this.commonMethod.snackBar("Record Update Successfully", 0);
            this.dialogRef.close('yes');
          }
        },
        error: ((err: any) => { this.errors.handelError(err) })
      });
    }
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
      "m_SchoolName": "string",
      "stateId": 0,
    });
  }

  clearDropdown(dropdown: string) {
    console.log(dropdown);
    if (dropdown == 'Taluka') {
      this.f['centerId'].setValue('');
      this.f['villageId'].setValue('');
      this.f['schoolName'].setValue('');
      this.f['s_TypeId'].setValue('');
      this.f['s_CategoryId'].setValue('');
      this.f['s_ManagementId'].setValue('');
      this.f['g_ClassId'].setValue('');
    }
    else if (dropdown == 'Kendra') {
      this.f['villageId'].setValue('');
      this.f['schoolName'].setValue('');
      this.f['s_TypeId'].setValue('');
      this.f['s_CategoryId'].setValue('');
      this.f['s_ManagementId'].setValue('');
      this.f['g_ClassId'].setValue('');
    }
    else if (dropdown == 'Village') {
      this.f['schoolName'].setValue('');
      this.f['s_TypeId'].setValue('');
      this.f['s_CategoryId'].setValue('');
      this.f['s_ManagementId'].setValue('');
      this.f['g_ClassId'].setValue('');
    }
    else if (dropdown == 'School Type') {
      this.f['s_CategoryId'].setValue('');
      this.f['s_ManagementId'].setValue('');
      this.f['g_ClassId'].setValue('');
    }
    else if (dropdown == 'Category Desc') {
      this.f['s_ManagementId'].setValue('');
      this.f['g_ClassId'].setValue('');
    }
    else if (dropdown == 'Management Desc') {
      this.f['g_ClassId'].setValue('');
    }
  }


}
