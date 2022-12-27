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

  uploadImg: any;
  uploadAadhar: any;
  editObj: any;
  languageFlag!: string
  imageArray = new Array();
  maxDate = new Date();
 

  @ViewChild('uploadImage') imageFile!: ElementRef;
  @ViewChild('uploadAadhar') aadharFile!: ElementRef;


  constructor(
    private fb: FormBuilder, private masterService: MasterService, private errors: ErrorsService,
    private fileUpl: FileUploadService, private apiService: ApiService, private webService: WebStorageService,
    private commonMethods: CommonMethodsService, public validators: ValidationService, private ngxSpinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<AddUpdateStudentRegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.languageFlag = this.webService.languageFlag;
    this.formData();
    this.data ? (this.editObj = this.data, this.patchValue()) : (
      this.allDropdownMethods()
    )
  }

  allDropdownMethods() {
    this.getDistrict(),
      this.getTaluka(),
      this.getCenter(),
      this.getSchool(),
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
      f_MName: ['', Validators.required],
      m_MName: ['', Validators.required],
      l_MName: ['', Validators.required],
      standard: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      religionId: ['', Validators.required],
      castId: ['', Validators.required],
      saralId: [''],
      mobileNo: ['', [Validators.required, Validators.pattern(this.validators.mobile_No)]],
      fatherFullName: ['', Validators.required],
      // m_FatherFullName: ['', Validators.required],
      motherName: ['', Validators.required],
      // m_MotherName: ['', Validators.required],
      aadharNo: ['', [Validators.required, Validators.pattern(this.validators.aadhar_card)]],
      // emailID:[''],
      physicallyDisabled: ['', Validators.required],
      photo: ['', Validators.required],
      aadharPhoto: ['', Validators.required]

    })
  }

  get fc() { return this.stuRegistrationForm.controls }

  //#region ---------------------------- Dropdown start here -----------------------------------------------

  getDistrict() {
    this.masterService.getAllDistrict(this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.districtArr = res.responseData;
          this.stuRegistrationForm.controls['districtId'].setValue(1);
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
          this.districtArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getTaluka() {
    this.masterService.getAllTaluka(this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.talukaArr = res.responseData;
          this.editObj ? this.stuRegistrationForm.controls['talukaId'].setValue(this.editObj.talukaId) : '';
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
          this.talukaArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getCenter() {
    this.masterService.getAllCenter(this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.centerArr = res.responseData;
          this.editObj ? this.stuRegistrationForm.controls['centerId'].setValue(this.editObj.centerId) : ''
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
          this.centerArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getSchool() {
    this.masterService.getAllSchoolType(this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.schoolArr = res.responseData;
          this.editObj ? this.stuRegistrationForm.controls['schoolId'].setValue(this.editObj.schoolId) : '';
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
          this.schoolArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getStandard() {
    this.masterService.getAllStandard(this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.standardArr = res.responseData;
          this.editObj ? this.stuRegistrationForm.controls['standard'].setValue(this.editObj.standardId) : '';
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
          this.standardArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getGender() {
    this.masterService.getAllGender(this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.genderArr = res.responseData;
          this.editObj ? this.stuRegistrationForm.controls['gender'].setValue(this.editObj.genderId) : '';
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
          this.genderArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getReligion() {
    this.masterService.getAllReligion(this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.religionArr = res.responseData;
          this.editObj ? (this.stuRegistrationForm.controls['religionId'].setValue(this.editObj.religionId), this.getCaste()) : '';
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
          this.religionArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getCaste() {
    let id = this.stuRegistrationForm.value.religionId;
    this.masterService.getAllCaste(this.languageFlag, id).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.casteArr = res.responseData;
          this.editObj ? this.stuRegistrationForm.controls['castId'].setValue(this.editObj.castId) : '';
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
          this.casteArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
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
    this.allDropdownMethods();
    this.imageArray = this.editObj?.documentResponse;
    let aadharObj = this.editObj?.documentResponse?.find((res: any) => res.documentId == 1);
    let imageObj = this.editObj?.documentResponse?.find((res: any) => res.documentId == 2);
    this.uploadAadhar = aadharObj?.docPath;
    this.uploadImg = imageObj?.docPath;
    this.stuRegistrationForm.controls['photo'].setValue(this.uploadImg?.split('/').pop());
    this.stuRegistrationForm.controls['aadharPhoto'].setValue(this.uploadAadhar?.split('/').pop());
  }

  //#region  ----------------------------------------------- Submit logic Start here ------------------------------------------------
  onSubmit() {
    this.ngxSpinner.show();
    let obj = this.stuRegistrationForm.value;
    let postObj = {
      ... this.webService.createdByProps(),
      "id": this.editFlag ? this.editObj.id : 0,
      "fName": obj.fName || '',
      "f_MName": obj.f_MName || '',
      "mName": obj.mName || '',
      "m_MName": obj.m_MName || '',
      "lName": obj.lName || '',
      "l_MName": obj.l_MName || '',
      "stateId": obj.stateId,
      "districtId": obj.districtId,
      "talukaId": obj.talukaId,
      "centerId": obj.centerId,
      "schoolId": obj.schoolId,
      "standard": obj.standard,
      "saralId": obj.saralId,
      "gender": obj.gender,
      "dob": obj.dob,
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
        "id": 0,
        "studentId": this.editFlag ? this.editObj.id : 0,
        "fatherFullName": obj.fatherFullName || '',
        "m_FatherFullName": '',
        "motherName": obj.motherName || '',
        "m_MotherName": '',
        "mobileNo": obj.mobileNo
      },
      "documentModel": this.imageArray,
      "lan": this.languageFlag
    }

    if (this.stuRegistrationForm.invalid) {
      this.ngxSpinner.hide();
      return
    } else {
      let url = this.editFlag ? 'UpdateStudent' : 'AddStudent'
      this.apiService.setHttp(this.editFlag ? 'put' : 'post', 'zp-osmanabad/Student/' + url, false, postObj, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode == 200) {
            this.ngxSpinner.hide();
            this.commonMethods.snackBar(res.statusMessage, 0);
            this.dialogRef.close('yes')
          } else {
            this.ngxSpinner.hide();
            this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
          }
        },
        error: ((err: any) => { this.ngxSpinner.hide(); this.errors.handelError(err) })
      });
    }
  }

  //#endregion   ----------------------------------------------- Submit logic End here ------------------------------------------------





  //#region ------------------------------------------- Image Logic Start Here -----------------------------------------------------------------
  fileUpload(event: any, name: string) {
    this.fileUpl.uploadDocuments(event, 'Upload', 'jpg, jpeg, png').subscribe((res: any) => {
      if (res.statusCode == 200) {
        if (name == 'img') {
          this.uploadImg = res.responseData;
          this.stuRegistrationForm.controls['photo'].setValue(this.uploadImg.split('/').pop());
          let obj = {
            "id": 0,
            "studentId": this.editFlag ? this.editObj.id : 0,
            "documentId": 1,
            "docPath": this.uploadImg
          }
          this.imageArray.push(obj);
        } else {
          this.uploadAadhar = res.responseData;
          this.stuRegistrationForm.controls['aadharPhoto'].setValue(this.uploadAadhar.split('/').pop());
          let obj = {
            "id": 0,
            "studentId": this.editFlag ? this.editObj.id : 0,
            "documentId": 2,
            "docPath": this.uploadAadhar
          }
          this.imageArray.push(obj);
        }
      } else {
        name == 'img' ? (this.uploadImg = '', this.imageFile.nativeElement.value = '', this.stuRegistrationForm.controls['photo'].setValue('')) : (
          this.uploadAadhar = '', this.aadharFile.nativeElement.value = '', this.stuRegistrationForm.controls['aadharPhoto'].setValue(''));
      }
    });
  }

  viewImages(name: string) {
    if (name == 'aadharPhoto') {
      window.open(this.uploadAadhar, 'blank');
    } else if (name == 'photo') {
      window.open(this.uploadImg, 'blank')
    }
  }

  deleteImage(name: string) {
    if (name == 'aadharPhoto') {
      this.uploadAadhar = '';
      this.aadharFile.nativeElement.value = '';
      this.stuRegistrationForm.controls['aadharPhoto'].setValue('');
    } else if (name == 'photo') {
      this.uploadImg = '';
      this.imageFile.nativeElement.value = '';
      this.stuRegistrationForm.controls['photo'].setValue('');
    }
  }

  //#region ------------------------------------------- Image Logic Start Here -----------------------------------------------------------------

}
