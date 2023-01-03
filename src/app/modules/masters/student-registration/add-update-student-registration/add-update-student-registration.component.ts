import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
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
  selector: 'app-add-update-student-registration',
  templateUrl: './add-update-student-registration.component.html',
  styleUrls: ['./add-update-student-registration.component.scss']
})
export class AddUpdateStudentRegistrationComponent {
  stuRegistrationForm!: FormGroup
  districtArr = new Array();
  talukaArr = new Array();
  centerArr = new Array();
  schoolArr = new Array();
  genderArr = new Array();
  religionArr = new Array();
  standardArr = new Array();
  casteArr = new Array();
  editFlag: boolean = false
  physicallyDisabled = [
    { id: 1, eName: 'Yes', mName: 'होय' },
    { id: 2, eName: 'No', mName: 'नाही' }
  ];

  uploadImg: string = '';
  uploadAadhaar: string = '';
  editObj: any;
  languageFlag!: string
  imageArray = new Array();
  maxDate = new Date();

  imgFlag: boolean = false;
  aadhaarFlag: boolean = false;



  @ViewChild('uploadImage') imageFile!: ElementRef;
  @ViewChild('uploadAadhar') aadharFile!: ElementRef;


  constructor(
    private fb: FormBuilder, private masterService: MasterService, private errors: ErrorsService,
    private fileUpl: FileUploadService, private apiService: ApiService, 
    private webService: WebStorageService, private datePipe:DatePipe,
    private commonMethods: CommonMethodsService, public validators: ValidationService, private ngxSpinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<AddUpdateStudentRegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.languageFlag = this.webService.languageFlag;
    this.formData();
    this.data ? (this.editObj = JSON.parse(this.data), this.patchValue()) : this.allDropdownMethods();
  }

  allDropdownMethods() {
    this.getDistrict(),
      this.getGender(),
      this.getReligion(),
      this.getStandard()
  }

  formData() {
    this.stuRegistrationForm = this.fb.group({
      districtId: [''],
      talukaId: ['', Validators.required],
      centerId: ['', Validators.required],
      schoolId: ['', Validators.required],
      fName: ['', Validators.required],
      mName: ['', Validators.required],
      lName: ['', Validators.required],
      f_MName: ['', [Validators.required, Validators.pattern('^[\u0900-\u0965 ]+$')]],
      m_MName: ['', [Validators.required, Validators.pattern('^[\u0900-\u0965 ]+$')]],
      l_MName: ['', [Validators.required, Validators.pattern('^[\u0900-\u0965 ]+$')]],
      standard: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      religionId: ['', Validators.required],
      castId: ['', Validators.required],
      saralId: ['',[Validators.maxLength(19),Validators.minLength(19)]],
      mobileNo: ['', [Validators.required, Validators.pattern(this.validators.mobile_No)]],
      fatherFullName: ['', Validators.required],
      // m_FatherFullName: ['', Validators.required],
      motherName: ['', Validators.required],
      // m_MotherName: ['', Validators.required],
      aadharNo: ['', [Validators.required, Validators.pattern(this.validators.aadhar_card)]],
      // emailID:[''],
      physicallyDisabled: ['', Validators.required]
    })
  }

  get fc() { return this.stuRegistrationForm.controls }

  //#region ---------------------------- Dropdown start here -----------------------------------------------

  getDistrict() {
    this.districtArr = [];
    this.masterService.getAllDistrict(this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.districtArr = res.responseData;
          this.stuRegistrationForm.controls['districtId'].setValue(1);
          this.getTaluka();
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
          this.districtArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err.statusCode) })
    });
  }

  getTaluka() {
    this.talukaArr = [];
    this.masterService.getAllTaluka(this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.talukaArr = res.responseData;
          this.editFlag ? (this.stuRegistrationForm.controls['talukaId'].setValue(this.editObj.talukaId), this.getAllCenter()) : '';
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
          this.talukaArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err.statusCode) })
    });
  }

  getAllCenter() {
    this.centerArr = [];
    let id = this.stuRegistrationForm.value.talukaId;
    this.masterService.getAllCenter(this.languageFlag, id).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.centerArr = res.responseData;
          this.editFlag ? (this.stuRegistrationForm.controls['centerId'].setValue(this.editObj.centerId), this.getAllSchoolsByCenterId()) : ''
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
          this.centerArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err.statusCode) })
    });
  }

  getAllSchoolsByCenterId() {
    this.schoolArr = [];
    let Tid = this.stuRegistrationForm.value.talukaId
    let Cid = this.stuRegistrationForm.value.centerId;
    this.masterService.getAllSchoolByCriteria(this.languageFlag, Tid, 0, Cid).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.schoolArr = res.responseData;
          this.editFlag ? this.stuRegistrationForm.controls['schoolId'].setValue(this.editObj.schoolId) : '';
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
          this.schoolArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err.statusCode) })
    });
  }

  getStandard() {
    this.standardArr = [];
    this.masterService.getAllStandard(this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.standardArr = res.responseData;
          this.editFlag ? this.stuRegistrationForm.controls['standard'].setValue(this.editObj.standardId) : '';
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
          this.standardArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err.statusCode) })
    });
  }

  getGender() {
    this.genderArr = [];
    this.masterService.getAllGender(this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.genderArr = res.responseData;
          this.editFlag ? this.stuRegistrationForm.controls['gender'].setValue(this.editObj.genderId) : '';
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
          this.genderArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err.statusCode) })
    });
  }

  getReligion() {
    this.religionArr = [];
    this.masterService.getAllReligion(this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.religionArr = res.responseData;
          this.editFlag ? (this.stuRegistrationForm.controls['religionId'].setValue(this.editObj.religionId), this.getCaste()) : '';
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
          this.religionArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err.statusCode) })
    });
  }

  getCaste() {
    this.casteArr = [];
    let id = this.stuRegistrationForm.value.religionId;
    this.masterService.getAllCaste(this.languageFlag, id).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.casteArr = res.responseData;
          this.editFlag ? this.stuRegistrationForm.controls['castId'].setValue(this.editObj.castId) : '';
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
          this.casteArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err.statusCode) })
    });
  }

  //#endregion  ---------------------------------- Dropdown End here -----------------------------------------------


  patchValue() {
    this.editFlag = true;
    this.stuRegistrationForm.patchValue({
      fName: this.editObj?.fName,
      mName: this.editObj?.mName,
      lName: this.editObj?.lName,
      f_MName: this.editObj?.f_MName,
      m_MName: this.editObj?.m_MName,
      l_MName: this.editObj?.l_MName,
      saralId: this.editObj?.saralId,
      mobileNo: this.editObj?.gaurdianResponse[0]?.mobileNo,
      fatherFullName: this.editObj?.gaurdianResponse[0]?.fatherFullName,
      // m_FatherFullName: this.editObj?.gaurdianResponse[0]?.m_FatherFullName,
      motherName: this.editObj?.gaurdianResponse[0]?.motherName,
      // m_MotherName: this.editObj?.gaurdianResponse[0]?.m_MotherName,
      aadharNo: this.editObj?.aadharNo,
      dob: new Date(this.editObj?.dob.split(' ')[0]),
      physicallyDisabled: this.editObj?.isHandicaped ? 1 : 2
    });
    this.imageArray = this.editObj?.documentResponse;
    console.log(this.imageArray);
    let aadharObj = this.editObj?.documentResponse?.find((res: any) => res.documentId == 2);
    let imageObj = this.editObj?.documentResponse?.find((res: any) => res.documentId == 1);
    this.uploadAadhaar = aadharObj?.docPath;
    this.uploadImg = imageObj?.docPath;
    this.allDropdownMethods();
  }
  //#region  ----------------------------------------------- Submit logic Start here ------------------------------------------------

  onSubmit() {
    this.ngxSpinner.show();
  
    let obj = this.stuRegistrationForm.value;
    let dateWithTime = this.datePipe.transform(obj.dob, 'yyyy-MM-dd' + 'T' + 'HH:mm:ss.ms');
    let postObj = {
      ... this.webService.createdByProps(),
      "id": this.editObj ? this.editObj.id : 0,
      "gaurdianId": this.editObj ? this.editObj.gaurdianId : 0,
      "fName": obj.fName || '',
      "f_MName": obj.f_MName || '',
      "mName": obj.mName || '',
      "m_MName": obj.m_MName || '',
      "lName": obj.lName || '',
      "l_MName": obj.l_MName || '',
      "stateId": obj.stateId || 1,
      "districtId": obj.districtId,
      "talukaId": obj.talukaId,
      "centerId": obj.centerId,
      "schoolId": obj.schoolId,
      "standard": obj.standard,
      "saralId": obj.saralId,
      "gender": obj.gender,
      "dob": dateWithTime,
      "religionId": obj.religionId,
      "castId": obj.castId,
      "aadharNo": obj.aadharNo,
      "isCastCertificate": true,
      "isParentsAlive": true,
      "isOnlyFatherAlive": true,
      "isOnlyMotherAlive": true,
      "isHandicaped": obj.physicallyDisabled == 1 ? true : false,
      "isHandicapedCertificate": true,
      "timestamp": new Date(),
      "localId": 0,
      "fatherFullName": obj.fatherFullName,
      "motherName": obj.motherName,
      "mobileNo": obj.mobileNo,
      "gaurdianModel": {
        ... this.webService.createdByProps(),
        "id": this.editObj ? this.editObj.gaurdianId : 0,
        "fatherFullName": obj.fatherFullName || '',
        "m_FatherFullName": '',
        "motherName": obj.motherName || '',
        "m_MotherName": '',
        "mobileNo": obj.mobileNo,
        "timestamp": new Date(),
        "localId": 0
      },
      "documentModel": this.imageArray,
      "lan": this.languageFlag
    }

    if (this.stuRegistrationForm.invalid) {
      this.ngxSpinner.hide();
      if (!this.uploadImg) { this.imgFlag = true };
      if (!this.uploadAadhaar) { this.aadhaarFlag = true };
      this.commonMethods.showPopup(this.webService.languageFlag == 'EN' ? 'Please Enter Mandatory Fields' : 'कृपया अनिवार्य फील्ड प्रविष्ट करा', 1);
      return
    } else {
      if (!this.uploadImg || !this.uploadAadhaar) {
        this.ngxSpinner.hide();
        if (!this.uploadImg) { this.imgFlag = true, this.commonMethods.showPopup(this.webService.languageFlag == 'EN' ? 'Please Enter Mandatory Fields' : 'कृपया अनिवार्य फील्ड प्रविष्ट करा', 1); };
        if (!this.uploadAadhaar) { this.aadhaarFlag = true, this.commonMethods.showPopup(this.webService.languageFlag == 'EN' ? 'Please Enter Mandatory Fields' : 'कृपया अनिवार्य फील्ड प्रविष्ट करा', 1); };
        return
      }
      let url = this.editObj ? 'UpdateStudent' : 'AddStudent'
      this.apiService.setHttp(this.editObj ? 'put' : 'post', 'zp-osmanabad/Student/' + url, false, postObj, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode == 200) {
            this.ngxSpinner.hide();
            this.commonMethods.showPopup(res.statusMessage, 0);
            this.dialogRef.close('yes')
          } else {
            this.ngxSpinner.hide();
            this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
          }
        },
        error: ((err: any) => { this.ngxSpinner.hide(); this.errors.handelError(err) })
      });
    }
  }

  //#endregion   ----------------------------------------------- Submit logic End here ------------------------------------------------





  //#region ------------------------------------------- Image Logic Start Here -----------------------------------------------------------------
  fileUpload(event: any, name: string) {
    let type = name == 'img' ? 'jpg, jpeg, png' : 'jpg, jpeg, png, pdf';
    this.fileUpl.uploadDocuments(event, 'Upload', type).subscribe((res: any) => {
      if (res.statusCode == 200) {
        if (name == 'img') {
          this.uploadImg = res.responseData;
        } else {
          this.uploadAadhaar = res.responseData;
        }
        this.commonMethods.showPopup(res.statusMessage, 0);
        let obj = {
          "id": 0,
          "studentId": this.editFlag ? this.editObj.id : 0,
          "documentId": name == 'img' ? 1 : 2,
          "docPath": name == 'img' ? this.uploadImg : this.uploadAadhaar
        }
        this.imageArray.push(obj);
        console.log(this.imageArray);

      } else {
        name == 'img' ? (this.uploadImg = '', this.imageFile.nativeElement.value = '') : (this.uploadAadhaar = '', this.aadharFile.nativeElement.value = '');
      }
    });
  }

  viewImages(name: string) {
    if (name == 'aadharPhoto') {
      window.open(this.uploadAadhaar, 'blank');
    } else if (name == 'photo') {
      window.open(this.uploadImg, 'blank')
    }
  }

  deleteImage(name: string) {
    if (name == 'aadharPhoto') {
      this.uploadAadhaar = '';
      this.aadharFile.nativeElement.value = '';
      let index = this.imageArray.findIndex(res => res.documentId == 2);
      this.imageArray.splice(index, 1);
    } else if (name == 'photo') {
      this.uploadImg = '';
      this.imageFile.nativeElement.value = '';
      let index = this.imageArray.findIndex(res => res.documentId == 1);
      this.imageArray.splice(index, 1);
    }
    console.log(this.imageArray);

  }

  //#region ------------------------------------------- Image Logic Start Here -----------------------------------------------------------------

  clearDropdown(name: any) {
    this.editFlag = false;
    if (name == 'talukaId') {
      this.stuRegistrationForm.controls['centerId'].setValue('');
      this.stuRegistrationForm.controls['schoolId'].setValue('');
    } else if (name == 'centerId') {
      this.stuRegistrationForm.controls['schoolId'].setValue('');
    } else if (name == 'religionId') {
      this.stuRegistrationForm.controls['castId'].setValue('');
    }
  }

  checkMobileNo() {
    let mobileNo = this.stuRegistrationForm.value.mobileNo;
    console.log(mobileNo);
    this.apiService.setHttp('get', 'zp-osmanabad/Student/GetGaurdianByMobileNo?MobileNo=' + mobileNo + '&lan=EN', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          if (this.languageFlag == 'EN') {
            this.fc['fatherFullName'].setValue(res.responseData?.fatherFullName);
            this.fc['motherName'].setValue(res.responseData?.motherName);
          } else {
            this.fc['fatherFullName'].setValue(res.responseData?.m_FatherFullName);
            this.fc['motherName'].setValue(res.responseData?.m_MotherName)
          }
          // this.commonMethods.snackBar(res.statusMessage, 0);
        } else {
          this.fc['fatherFullName'].setValue('');
          this.fc['motherName'].setValue('');
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
        }
      },
      error: ((err: any) => { this.ngxSpinner.hide(); this.errors.handelError(err) })
    });

  }


}
