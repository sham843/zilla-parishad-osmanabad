import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-add-update-office-users',
  templateUrl: './add-update-office-users.component.html',
  styleUrls: ['./add-update-office-users.component.scss']
})
export class AddUpdateOfficeUsersComponent implements OnInit {
  levels = new Array();
  designations = new Array();
  officeForm!: FormGroup;
  districts = new Array();
  talukas = new Array();
  centers = new Array();
  schools = new Array();

  constructor(private masterService: MasterService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonMethodsService,
    private error: ErrorsService,
    private dialogRef: MatDialogRef<AddUpdateOfficeUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public validation: ValidationService,
    public webStorageService: WebStorageService,
    private ngxSpinner: NgxSpinnerService) { }

  ngOnInit() {
    this.defaultForm();
    // console.log("dataaa",this.data);
    (!this.data) ? (this.getLevelDrop()) : '';
  }

  defaultForm() {
    this.officeForm = this.fb.group(
      {
        // "createdBy": [0],
        // "modifiedBy": [0],
        // "createdDate": [new Date()],
        // "modifiedDate": [new Date()],
        // "isDeleted": [true],
        ...this.webStorageService.createdByProps(),
        "id": [this.data ? this.data.id : 0],
        "name": [this.data ? this.data.officeName : "", [Validators.required, Validators.pattern(this.validation.fullName)]],
        "m_Name": [this.data ? this.data.m_OfficeName : "", [Validators.required,Validators.pattern('^[\u0900-\u0965 ]+$')]],
        "mobileNo": [this.data ? this.data.mobileNo : "", [Validators.required, Validators.pattern(this.validation.mobile_No)]],
        "emailId": [this.data ? this.data.emailId : "", [Validators.required, Validators.pattern(this.validation.email)]],
        "address": [this.data ? this.data.address : "",],
        "schoolId": [this.data ? this.data.schoolId : 0],
        "designationId": [this.data ? this.data.designationId : null, Validators.required],
        "designationLevelId": [this.data ? this.data.designationLevelId : null,[Validators.required]],
        "stateId": [this.data ? 0 : 0],
        "districtId": [this.data ? this.data.districtId : null, Validators.required ],
        "talukaId": [this.data ? this.data.talukaId : null, Validators.required ],
        "userTypeId": [this.webStorageService.getUserTypeId()],
        "subUserTypeId": [this.data ? 0 : 0],
        "kendraMobileNo": [this.data ? this.data.kendraMobileNo : "", [Validators.pattern(this.validation.mobile_No)]],
        "kendraEmailId": [this.data ? this.data.kendraEmailId : "", [Validators.pattern(this.validation.email)]],
        "beoEmailId": [this.data ? this.data.beoEmailId : "", [Validators.pattern(this.validation.email)]],
        "beoMobileNo": [this.data ? this.data.beoMobileNo : "", [Validators.pattern(this.validation.mobile_No)]],
        "centerId": [this.data ? this.data.centerId : 0 ],
        "bitName": [this.data ? this.data.bitName : ""],
        "lan": [this.webStorageService.languageFlag],
      })
    this.data ? console.log("edit : ", this.data, this.getLevelDrop(), this.getCenterDrop(), this.getDistrictDrop(), this.getTalukaDrop(), this.getDesignationByLevelId()) : ''
    // this.getDistrictDrop();
    // this.getTalukaDrop();
    // this.getDesignationByLevelId();
  }

  get fc() { return this.officeForm.controls }

  getLevelDrop() {
    this.masterService.GetAllDesignationLevel(this.webStorageService.languageFlag).subscribe({
      next: (resp: any) => {
        console.log("level",resp);
        resp.statusCode == "200" ? this.levels = resp.responseData : this.levels = [];
      },
      error: (error: any) => {
        console.log("error is :", error);
      }
    });
  }

  onchangeLevel(event: any) {
    console.log(event.value);
    this.getDistrictDrop();
    this.getTalukaDrop();
    this.getDesignationByLevelId();
  }

  getDesignationByLevelId() {
    let levelId = this.officeForm.value.designationLevelId;
    // console.log(levelId);
    this.masterService.GetDesignationByLevelId(this.webStorageService.languageFlag, levelId).subscribe({
      next: (resp: any) => {
        // console.log("designation : ",resp);
        resp.statusCode == "200" ? this.designations = resp.responseData : this.designations = [];
      },
      error: (error: any) => {
        console.log("error is getDesignationByLevelId:", error);
      }
    })
  }

  getAllSchoolsByCenterId() {
    let centerId = this.officeForm.value.centerId;
    this.masterService.getAllSchoolsByCenterId(this.webStorageService.languageFlag, centerId).subscribe({
      next: (resp: any) => {
        resp.statusCode == "200" ? (this.schools = resp.responseData) : this.schools = [];
      },
      error: (error: any) => {
        console.log("error is :", error);
      }
    });
  }

  getDistrictDrop() {
    this.masterService.getAllDistrict(this.webStorageService.languageFlag).subscribe({
      next: (resp: any) => {
        resp.statusCode == "200" ? this.districts = resp.responseData : this.districts = [];
      },
      error: (error: any) => {
        console.log("error is :", error);
      }
    });
  }

  getTalukaDrop() {
    this.masterService.getAllTaluka(this.webStorageService.languageFlag).subscribe({
      next: (resp: any) => {
        resp.statusCode == "200" ? (this.talukas = resp.responseData) : this.talukas = [];
      },
      error: (error: any) => {
        console.log("error is :", error);
      }
    });
  }

  getCenterDrop() {
    // console.log(this.officeForm.value.designationId);
    if(this.officeForm.value.designationLevelId == 2 && this.officeForm.value.designationId == 20){
      this.masterService.getAllCenter(this.webStorageService.languageFlag, this.officeForm.value.talukaId).subscribe({
        next: (resp: any) => {
          resp.statusCode == "200" ? (this.centers = resp.responseData) : this.centers = [];
          this.data ? (this.fc['centerId'].setValue(this.data.centerId)) : 0;
        },
        error: (error: any) => {
          console.log("error is :", error);
        }
      })
    }

  }

  submitOfficeData() {
    console.log("all data submitted:", this.officeForm.value);
    if(this.officeForm.valid) {
      this.ngxSpinner.show();
      let submitUrl = this.data ? 'UpdateOffice' : 'AddOffice'
      // this.apiService.setHttp(this.data ? 'PUT' : 'POST', this.data ? 'zp_osmanabad/Office/UpdateOffice' : 'zp_osmanabad/Office/AddOffice', false, this.officeForm.value, false, 'baseUrl');
      this.apiService.setHttp(this.data ? 'PUT' : 'POST', 'zp_osmanabad/Office/'+submitUrl, false, this.officeForm.value, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          res.statusCode == "200" ? ( this.commonService.showPopup(res.statusMessage, 0)) : this.commonService.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.showPopup(res.statusMessage, 1);
          res.statusCode == "200" ?  this.dialogRef.close('Yes') :  this.ngxSpinner.hide();
        },
        error: ((error: any) => {
          this.error.handelError(error.status);
          this.commonService.checkEmptyData(error.status) == false ? this.error.handelError(error.status) : this.commonService.showPopup(error.status, 1);
        })
      });
    }
    if (this.officeForm.invalid) {
      this.commonService.showPopup(this.webStorageService.languageFlag == 'EN' ? 'Please Enter Mandatory Fields' : 'कृपया अनिवार्य फील्ड प्रविष्ट करा', 1);
      return
    }
  }

  // validShilpa
  onchangeValidation(event: any, label: string) {
    console.log("event, label", event.value, label);
    if ((event.value == 1 || event.value == 2) && label == 'Level') {
      this.fc['districtId'].setValidators(Validators.required);
      this.fc['districtId'].updateValueAndValidity();

      this.fc['talukaId'].setValidators(Validators.required);
      this.fc['talukaId'].updateValueAndValidity();

      this.fc['designationId'].setValidators(Validators.required);
      this.fc['designationId'].updateValueAndValidity();
    }
   else if (event.value == 5 && label == 'Level') {
      this.fc['districtId'].setValidators(Validators.required);
      this.fc['districtId'].updateValueAndValidity();

      this.fc['talukaId'].setValidators(Validators.required);
      this.fc['talukaId'].updateValueAndValidity();

      this.fc['designationId'].setValidators(Validators.required);
      this.fc['designationId'].updateValueAndValidity();

      this.fc['bitName'].setValidators([Validators.required, Validators.pattern(this.validation.fullName)]);
      this.fc['bitName'].updateValueAndValidity();
    }
    else if (event.value == 6 || event.value == 7 && label == 'Level') {
      this.fc['address'].setValidators([Validators.required, Validators.maxLength(500)]);
      this.fc['address'].updateValueAndValidity();
    }
    else if (event.value == 17 && label == 'Designation') {
      this.fc['beoMobileNo'].setValidators([Validators.required, Validators.pattern(this.validation.mobile_No)]);
      this.fc['beoMobileNo'].updateValueAndValidity();
      this.fc['beoEmailId'].setValidators([Validators.required, Validators.pattern(this.validation.email)]);
      this.fc['beoEmailId'].updateValueAndValidity();
    }
    else if (event.value == 20 && label == 'Designation') {
      console.log("enter in kendrapramukh");
      this.fc['centerId'].setValidators([Validators.required]);
      this.fc['centerId'].updateValueAndValidity();

      // this.fc['kendraMobileNo'].setValidators([Validators.required, Validators.pattern(this.validation.mobile_No)]);
      // this.fc['kendraMobileNo'].updateValueAndValidity();

      // this.fc['kendraEmailId'].setValidators([Validators.required, Validators.pattern(this.validation.email)]);
      // this.fc['kendraEmailId'].updateValueAndValidity();
    }
    // else if(){

    // }
  }

  onchangeV(event: any, label: string){
    console.log(this.officeForm.value.designationId);

    // for admin and pratham
    // (this.officeForm.value.designationLevelId == 6 || this.officeForm.value.designationLevelId == 7)  ? this.fc['districtId'].setValue(0) : this.fc['districtId'].setValue(null);
    // (this.officeForm.value.designationLevelId == 6 || this.officeForm.value.designationLevelId == 7) ?this.fc['talukaId'].setValue(0) : this.fc['talukaId'].setValue(null);
    // (this.officeForm.value.designationLevelId == 5 || this.officeForm.value.designationLevelId == 6 || this.officeForm.value.designationLevelId == 7) ? this.fc['designationId'].setValue(0) : this.fc['designationId'].setValue(null);
    
    if(label == 'Level' && (event.value == 7 || event.value == 6)){
      this.fc['address'].setValidators([Validators.required, Validators.maxLength(500)]);
      this.fc['address'].updateValueAndValidity();

      this.fc['districtId'].clearValidators();
      this.fc['districtId'].updateValueAndValidity();

      this.fc['talukaId'].clearValidators();
      this.fc['talukaId'].updateValueAndValidity();
      this.fc['designationId'].clearValidators();
      this.fc['designationId'].updateValueAndValidity();

      // this.fc['districtId'].setValue(0);
      // this.fc['talukaId'].setValue(0);
      // this.fc['designationId'].setValue(0);
    (this.officeForm.value.designationLevelId == 6 || this.officeForm.value.designationLevelId == 7)  ? this.fc['districtId'].setValue(0) : this.fc['districtId'].setValue(null);
    (this.officeForm.value.designationLevelId == 6 || this.officeForm.value.designationLevelId == 7) ?this.fc['talukaId'].setValue(0) : this.fc['talukaId'].setValue(null);
    (this.officeForm.value.designationLevelId == 6 || this.officeForm.value.designationLevelId == 7) ?this.fc['centerId'].setValue(0) : this.fc['centerId'].setValue(null);
    (this.officeForm.value.designationLevelId == 6 || this.officeForm.value.designationLevelId == 7) ?this.fc['designationId'].setValue(0) : this.fc['designationId'].setValue(null);

      // this.fc['centerId'].setValue(0);
    }
    // for district level 
    if ((event.value == 1 || event.value == 2) && label == 'Level') {
      this.fc['districtId'].setValidators(Validators.required);
      this.fc['districtId'].updateValueAndValidity();

      this.fc['talukaId'].setValidators(Validators.required);
      this.fc['talukaId'].updateValueAndValidity();

      this.fc['designationId'].setValidators(Validators.required);
      this.fc['designationId'].updateValueAndValidity();
    }
// for Extension level
   else if(event.value == 5  && label == 'Level'){
      this.fc['bitName'].setValidators([Validators.required, Validators.pattern(this.validation.fullName)]);
      this.fc['bitName'].updateValueAndValidity();
      this.fc['designationId'].clearValidators();
      this.fc['designationId'].updateValueAndValidity();
      this.fc['designationId'].setValue(0)
    }

    // designation BEO 

    else if(label == 'Designation' && event.value == 17 ){
      console.log("enter in BEO",this.officeForm.value.designationId);
      this.fc['beoMobileNo'].setValidators([Validators.required, Validators.pattern(this.validation.mobile_No)]);
      this.fc['beoMobileNo'].updateValueAndValidity();
      this.fc['beoEmailId'].setValidators([Validators.required, Validators.pattern(this.validation.email)]);
      this.fc['beoEmailId'].updateValueAndValidity();
    }
    else if(label == 'Designation' && event.value != 17){
      this.fc['beoMobileNo'].clearValidators();
      this.fc['beoMobileNo'].updateValueAndValidity();
      this.fc['beoEmailId'].clearValidators();
      this.fc['beoEmailId'].updateValueAndValidity();
    }

    else if(label == 'Designation' && event.value == 20 ){
      this.fc['centerId'].setValidators([Validators.required]);
      this.fc['centerId'].updateValueAndValidity();
    }
  }

  clearDrop(label: string){
    if (label == 'Level') {
      this.fc['name'].setValue('');
      this.fc['m_Name'].setValue('');
      this.fc['mobileNo'].setValue('');
      this.fc['emailId'].setValue('');
      this.fc['address'].setValue('');
      this.fc['designationId'].setValue('');
      this.fc['districtId'].setValue('');
      this.fc['talukaId'].setValue('');
      // this.fc['kendraMobileNo'].setValue('');
      // this.fc['kendraEmailId'].setValue('');
      // this.fc['beoEmailId'].setValue('');
      // this.fc['beoMobileNo'].setValue('');
      // this.fc['centerId'].setValue('');
      // this.fc['bitName'].setValue('');
    }

    if (label == 'Taluka') {
      this.fc['name'].setValue('');
      this.fc['m_Name'].setValue('');
      this.fc['mobileNo'].setValue('');
      this.fc['emailId'].setValue('');
      this.fc['address'].setValue('');
      // this.fc['designationId'].setValue('');
      // this.fc['kendraMobileNo'].setValue('');
      // this.fc['kendraEmailId'].setValue('');
      // this.fc['beoEmailId'].setValue('');
      // this.fc['beoMobileNo'].setValue('');
      // this.fc['centerId'].setValue('');
      // this.fc['bitName'].setValue('');
    }
    if (label == 'Designation') {
      this.fc['name'].setValue('');
      this.fc['m_Name'].setValue('');
      this.fc['mobileNo'].setValue('');
      this.fc['emailId'].setValue('');
      this.fc['address'].setValue('');
      // this.fc['kendraMobileNo'].setValue('');
      // this.fc['kendraEmailId'].setValue('');
      // this.fc['beoEmailId'].setValue('');
      // this.fc['beoMobileNo'].setValue('');
      // this.fc['centerId'].setValue('');
      // this.fc['bitName'].setValue('');
    }
    if (label == 'Kendra') {
      this.fc['name'].setValue('');
      this.fc['m_Name'].setValue('');
      this.fc['mobileNo'].setValue('');
      this.fc['emailId'].setValue('');
      this.fc['address'].setValue('');
      // this.fc['kendraMobileNo'].setValue('');
      // this.fc['kendraEmailId'].setValue('');
      // this.fc['beoEmailId'].setValue('');
      // this.fc['beoMobileNo'].setValue('');
      // this.fc['bitName'].setValue('');
    }

  }

  // clearShilpa
  clearDropDown(label: string) {
    console.log("label : ", label);
    if (label == 'Level') {
      (this.officeForm.value.designationLevelId == 6 || this.officeForm.value.designationLevelId == 7)  ? this.fc['districtId'].setValue(0) : this.fc['districtId'].setValue(null);
      (this.officeForm.value.designationLevelId == 6 || this.officeForm.value.designationLevelId == 7) ?this.fc['talukaId'].setValue(0) : this.fc['talukaId'].setValue(null);
      (this.officeForm.value.designationLevelId == 5 || this.officeForm.value.designationLevelId == 6 || this.officeForm.value.designationLevelId == 7) ? this.fc['designationId'].setValue(0) : this.fc['designationId'].setValue(null);
      this.fc['bitName'].setValue('');
      this.fc['schoolId'].setValue(0);
      this.fc['beoEmailId'].setValue('');
      this.fc['beoMobileNo'].setValue('');
      this.fc['m_Name'].setValue('');
      this.fc['name'].setValue('');
      this.fc['mobileNo'].setValue('');
      this.fc['emailId'].setValue('');
      this.fc['address'].setValue('');
      this.fc['kendraEmailId'].setValue('');
      this.fc['kendraMobileNo'].setValue('');

      // this.officeForm.value.designationLevelId == 5 ? this.fc['beoMobileNo'].setValue('') : this.fc['beoMobileNo'].setValue('')
    }
    else if (label == 'Taluka') {
      (this.officeForm.value.designationLevelId == 5 || this.officeForm.value.designationLevelId == 6 || this.officeForm.value.designationLevelId == 7) ? this.fc['designationId'].setValue(0) : this.fc['designationId'].setValue(null);
      this.fc['schoolId'].setValue(0);
      this.fc['bitName'].setValue('');
      this.fc['beoEmailId'].setValue('');
      this.fc['beoMobileNo'].setValue('');
      this.fc['m_Name'].setValue('');
      this.fc['name'].setValue('');
      this.fc['mobileNo'].setValue('');
      this.fc['emailId'].setValue('');
      this.fc['address'].setValue('');
      this.fc['kendraEmailId'].setValue('');
      this.fc['kendraMobileNo'].setValue('');
    }
    else if (label == 'Designation') {
      // this.officeForm.value.designationId == 20 ? this.fc['centerId'].setValue(null): this.fc['centerId'].setValue(0);
      this.fc['kendraMobileNo'].setValue('');
      this.fc['kendraEmailId'].setValue('');
      // this.fc['centerId'].setValue(0);
      this.fc['beoEmailId'].setValue('');
      this.fc['beoMobileNo'].setValue('');
      this.fc['m_Name'].setValue('');
      this.fc['name'].setValue('');
      this.fc['mobileNo'].setValue('');
      this.fc['emailId'].setValue('');
      this.fc['address'].setValue('');
      this.fc['kendraEmailId'].setValue('');
      this.fc['kendraMobileNo'].setValue('');
    }
    else if (label == 'Kendra') {
      // this.fc['schoolId'].setValue(0);
      this.fc['kendraMobileNo'].setValue('');
      this.fc['kendraEmailId'].setValue('');
      // this.fc['beoEmailId'].setValue('');
      // this.fc['beoMobileNo'].setValue('');
      this.fc['m_Name'].setValue('');
      this.fc['name'].setValue('');
      this.fc['mobileNo'].setValue('');
      this.fc['emailId'].setValue('');
      this.fc['kendraEmailId'].setValue('');
      this.fc['kendraMobileNo'].setValue('');
      // this.fc['address'].setValue('');
    }
  }


}
