import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

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
  showAddRemImg: boolean = false;

  constructor(private masterService: MasterService, private errors: ErrorsService, private fb: FormBuilder, private fileUpload: FileUploadService,
    private apiService: ApiService, private commonMethod: CommonMethodsService, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdateSchoolRegistrationComponent>, public validationService: ValidationService, public webStorageS: WebStorageService,
    private ngxSpinner: NgxSpinnerService) { }

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
    let data = this.webStorageS.createdByProps();

    this.schoolRegForm = this.fb.group({
      "id": this.data ? this.data.id : 0,
      "schoolName": [this.data ? this.data.schoolName : '', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z ]*$')]],
      "m_SchoolName": [this.data ? this.data.m_SchoolName : '', Validators.required],
      "stateId": 0,
      "districtId": ['', Validators.required],
      "talukaId": ['', Validators.required],
      "villageId": ['', Validators.required],
      "centerId": ['', Validators.required],
      "s_CategoryId": ['', Validators.required],
      "s_ManagementId": ['', Validators.required],
      "s_TypeId": ['', Validators.required],
      "g_ClassId": ['', Validators.required],
      "lan": "EN",
      "localID": 0,
      "lowestClass": 0,
      "highestClass": 0,
      "timesStamp": new Date(),
      "docPath": [''],
      "createdBy": data.createdBy,
      "createdDate": data.createdDate,
      "modifiedBy": data.modifiedBy,
      "modifiedDate": data.modifiedDate,
      "isDeleted": data.isDeleted
    })
  }

  //#region ---------------------------------------------- School Registration Dropdown start here ----------------------------------------// 
  getDistrict() {
    this.masterService.getAllDistrict(this.webStorageS.languageFlag).subscribe({
      next: (res: any) => {
        res.statusCode == "200" ? this.districtArr = res.responseData : this.districtArr = [];
        this.editFlag ? (this.f['districtId'].setValue(this.data.districtId), this.getTaluka()) : '';
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getTaluka() {
    this.masterService.getAllTaluka(this.webStorageS.languageFlag).subscribe({
      next: (res: any) => {
        res.statusCode == "200" ? this.talukaArr = res.responseData : this.talukaArr = [];
        this.editFlag ? (this.f['talukaId'].setValue(this.data.talukaId), this.getCenter()) : '';
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getCenter() {
    this.masterService.getAllCenter(this.webStorageS.languageFlag).subscribe({
      next: (res: any) => {
        res.statusCode == "200" ? this.centerArr = res.responseData : this.centerArr = [];
        this.editFlag ? (this.f['centerId'].setValue(this.data.centerId), this.getVillage()) : '';
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getVillage() {
    this.masterService.getAllVillage(this.webStorageS.languageFlag, this.schoolRegForm.value.talukaId).subscribe({
      next: (res: any) => {
        res.statusCode == "200" ? this.villageArr = res.responseData : this.villageArr = [];
        this.editFlag ? (this.f['villageId'].setValue(this.data.villageId), this.getSchoolType()) : '';
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getSchoolType() {
    this.masterService.getAllSchoolType(this.webStorageS.languageFlag).subscribe({
      next: (res: any) => {
        res.statusCode == "200" ? this.schoolTypeArr = res.responseData : this.schoolTypeArr = [];
        this.editFlag ? (this.f['s_TypeId'].setValue(this.data.s_TypeId), this.getCategoryDes()) : '';
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getCategoryDes() {
    this.masterService.GetSchoolCategoryDescById(this.webStorageS.languageFlag).subscribe({
      next: (res: any) => {
        res.statusCode == "200" ? this.categoryArr = res.responseData : this.categoryArr = [];
        this.editFlag ? (this.f['s_CategoryId'].setValue(this.data.s_CategoryId), this.getSchoolMngDesc()) : '';
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getSchoolMngDesc() {
    this.masterService.GetSchoolMngDescById(this.webStorageS.languageFlag).subscribe({
      next: (res: any) => {
        res.statusCode == "200" ? this.schoolMngArr = res.responseData : this.schoolMngArr = [];
        this.editFlag ? (this.f['s_ManagementId'].setValue(this.data.s_ManagementId), this.getGroupClass()) : '';
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getGroupClass() {
    this.masterService.getAllGroupClass(this.webStorageS.languageFlag).subscribe({
      next: (res: any) => {
        res.statusCode == "200" ? this.groupclassArr = res.responseData : this.groupclassArr = [];
        this.editFlag ? this.f['g_ClassId'].setValue(this.data.g_ClassId) : '';
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }
  //#endregion ------------------------------------------- School Registration Dropdown end here ----------------------------------------// 

  //#region ------------------------------------------------- Upload Image start here --------------------------------------------// 
  imgUpload(event: any) {
    this.fileUpload.uploadDocuments(event, 'Upload', 'jpg, jpeg, png').subscribe((res: any) => {
      this.uploadImg = res.responseData;
      this.showAddRemImg = true;
    });
  }
  //#endregionegion ------------------------------------------------- Upload Image end here --------------------------------------------// 

  //#region ------------------------------------------------- Add/Update Record start here --------------------------------------------//
  onSubmit() {
    let formValue = this.schoolRegForm.value;
    formValue.docPath ? formValue.docPath = this.uploadImg : '';
    !this.showAddRemImg ? formValue.docPath = '' : formValue.docPath = formValue.docPath;

    let url;
    this.editFlag ? url = 'ZP-Osmanabad/School/Update' : url = 'ZP-Osmanabad/School/Add';

    if (!this.schoolRegForm.valid) {
      return
    }
    else {
      this.ngxSpinner.show();
      this.apiService.setHttp(this.editFlag ? 'put' : 'post', url, false, formValue, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          this.ngxSpinner.hide();
          if (res.statusCode == "200") {
            this.editFlag ? this.commonMethod.snackBar("Record Update Successfully", 0) : this.commonMethod.snackBar("Record Added Successfully", 0);
            this.dialogRef.close('yes');
          }
          else{
            this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        },
        error: ((err: any) => { 
          this.ngxSpinner.hide();
          this.commonMethod.checkEmptyData(err.statusMessage) == false ? this.errors.handelError(err.statusCode) : this.commonMethod.snackBar(err.statusMessage, 1);
        })
      });
    }
  }
  //#endregiongion ------------------------------------------ Add/Update Record end here --------------------------------------------//

  //#region ------------------------------------------------- Edit Record start here --------------------------------------------//
  onEdit() {
    this.editFlag = true;
    this.data.docPath ? this.schoolRegForm.value.docPath = this.data.docPath : '';
    this.data.docPath ? this.showAddRemImg = true : this.showAddRemImg = false;
    this.formFeild();
  }
  //#endregiongion ---------------------------------------------- Edit Record end here --------------------------------------------//

  //#region ------------------------------------------------- Clear Img field start here --------------------------------------------//
  clearImg() {
    this.schoolRegForm.value.docPath = '';
    this.f['docPath'].setValue('');
    this.showAddRemImg = false;
  }
  //#endregionegion --------------------------------------------- Clear Img field end here --------------------------------------------//

  //#region ----------------------------------------------- Clear dropdown on change start here --------------------------------------------//
  clearDropdown(dropdown: string) {
    this.editFlag = false;
    if (dropdown == 'Taluka') {
      this.villageArr = [];
      this.schoolTypeArr = [];
      this.categoryArr = [];
      this.schoolMngArr = [];
      this.groupclassArr = [];
      this.f['centerId'].setValue('');
      this.f['schoolName'].setValue('');
    }
    else if (dropdown == 'Kendra') {
      this.f['villageId'].setValue('');
      this.f['schoolName'].setValue('');
      this.schoolTypeArr = [];
      this.categoryArr = [];
      this.schoolMngArr = [];
      this.groupclassArr = [];
    }
    else if (dropdown == 'Village') {
      this.f['schoolName'].setValue('');
      this.f['s_TypeId'].setValue('');
      this.schoolTypeArr = [];
      this.categoryArr = [];
      this.schoolMngArr = [];
      this.groupclassArr = [];
    }
    else if (dropdown == 'School Type') {
      this.f['s_CategoryId'].setValue('');
      this.categoryArr = [];
      this.schoolMngArr = [];
      this.groupclassArr = [];
    }
    else if (dropdown == 'Category Desc') {
      this.f['s_ManagementId'].setValue('');
      this.schoolMngArr = [];
      this.groupclassArr = [];
    }
    else if (dropdown == 'Management Desc') {
      this.f['g_ClassId'].setValue('');
      this.groupclassArr = [];
    }
  }
  //#endregiongion ----------------------------------------------- Clear dropdown on change end here --------------------------------------------//

}
