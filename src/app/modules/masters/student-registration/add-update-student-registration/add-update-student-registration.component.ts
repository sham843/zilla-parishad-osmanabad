import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { MasterService } from 'src/app/core/services/master.service';
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

  physicallyDisabled = [
    { id: 1, name: 'Yes' },
    { id: 2, name: 'No' }
  ]

  @ViewChild('uploadImage') imageFile!: ElementRef;
  @ViewChild('uploadAadhar') aadharFile!: ElementRef;
  uploadImg: any;
  uploadAadhar: any;
  editObj: any;
  languageFlag!: string

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private errors: ErrorsService,
    private fileUpl: FileUploadService,
    private apiService: ApiService,
    private webService: WebStorageService,
    public dialogRef: MatDialogRef<AddUpdateStudentRegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.languageFlag = this.webService.languageFlag;
    this.formData();
    this.getDistrict();
    this.getTaluka();
    this.getCenter();
    this.getSchool();
    this.getGender();
    this.getReligion();
    this.getStandard();
    this.getCaste();
    this.data ? this.getById(this.data) : ''
  }

  formData() {
    this.stuRegistrationForm = this.fb.group({
      districtId: [{ value: 1, disabled: true }],
      talukaId: [''],
      centerId: [''],
      schoolId: [''],
      fName: [''],
      mName: [''],
      lName: [''],
      f_MName: [''],
      m_MName: [''],
      l_MName: [''],
      standard: [''],
      dob: [''],
      gender: [''],
      religionId: [''],
      castId: [''],
      saralId: [''],
      mobileNo: [''],
      fatherFullName: [''],
      motherName: [''],
      aadharNo: [''],
      // emailID:[''],
      physicallyDisabled: ['']

    })
  }

  getDistrict() {
    this.masterService.getAllDistrict(this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.districtArr = res.responseData;
        } else {
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
          this.editObj ? this.stuRegistrationForm.controls['standard'].setValue(this.editObj.standard) : '';
        } else {
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
          this.editObj ? this.stuRegistrationForm.controls['gender'].setValue(this.editObj.gender) : '';
        } else {
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
          this.editObj ? this.stuRegistrationForm.controls['religionId'].setValue(this.editObj.religionId) : '';
        } else {
          this.religionArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getCaste() {
    this.masterService.getAllCaste(this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.casteArr = res.responseData;
          this.editObj ? this.stuRegistrationForm.controls['castId'].setValue(this.editObj.castId) : '';
        } else {
          this.casteArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  fileUpload(event: any, name: string) {
    console.log(event);
    this.fileUpl.uploadDocuments(event, 'Upload', 'jpg, jpeg, png').subscribe((res: any) => {
      name == 'img' ? this.uploadImg = res.responseData : this.uploadAadhar = res.responseData;
    });
  }

  getById(obj: any) {
    this.apiService.setHttp('get', 'zp-osmanabad/Student/GetById?Id=' + obj.id, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.editObj = res.responseData;
          console.log(this.editObj);
          this.patchValue();
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  patchValue() {
    this.stuRegistrationForm.patchValue({
      districtId: 1,
      fullName: this.editObj.fullName,
      saralId: this.editObj.saralId,
      mobileNo: this.editObj.gaurdianModel.mobileNo,
      fatherFullName: this.editObj.gaurdianModel.fatherFullName,
      motherName: this.editObj.gaurdianModel.motherName,
      dob: this.editObj.dob.split('T')[0]
    })
    this.getTaluka();
    this.getCenter();
    this.getSchool();
    this.getGender();
    this.getReligion();
    this.getStandard();
    this.getCaste();

  }

  onSubmit() {
    let obj = this.stuRegistrationForm.value;
    let postObj = {
      "createdBy": 0,
      "modifiedBy": 0,
      "createdDate": "2022-12-21T07:11:24.503Z",
      "modifiedDate": "2022-12-21T07:11:24.503Z",
      "isDeleted": true,
      "id": 0,
      "fName": obj.fName,
      "f_MName": obj.f_MName,
      "mName": obj.mName,
      "m_MName": obj.m_MName,
      "lName": obj.lName,
      "l_MName": obj.l_MName,
      "stateId": obj.stateId,
      "districtId": obj.districtId,
      "talukaId": obj.talukaId,
      "centerId": obj.centerId,
      "schoolId": obj.schoolId,
      "standard": obj.standard,
      "saralId": obj.saralId,
      "gender": obj.gender,
      "dob": "2022-12-21T07:11:24.503Z",
      "religionId": obj.religionId,
      "castId": obj.castId,
      "aadharNo": obj.aadharNo,
      "isCastCertificate": true,
      "isParentsAlive": true,
      "isOnlyFatherAlive": true,
      "isOnlyMotherAlive": true,
      "isHandicaped": obj.physicallyDisabled == 1 ? true : false,
      "isHandicapedCertificate": true,
      "timestamp": "2022-12-21T07:11:24.503Z",
      "localId": 0,
      "fatherFullName": obj.fatherFullName,
      "motherName": obj.motherName,
      "mobileNo": obj.mobileNo,
      "gaurdianModel": {
        "id": 0,
        "studentId": 0,
        "fatherFullName": obj.fatherFullName,
        "m_FatherFullName": obj.m_FatherFullName,
        "motherName": obj.motherName,
        "m_MotherName": obj.m_MotherName,
        "mobileNo": obj.mobileNo
      },
      "documentModel": [
        {
          "id": 0,
          "studentId": 0,
          "documentId": 1,
          "docPath": this.uploadImg
        },
        {
          "id": 0,
          "studentId": 0,
          "documentId": 2,
          "docPath": this.uploadAadhar
        }
      ],
      "lan": "string"
    }

    this.apiService.setHttp('post', 'zp-osmanabad/Student/AddStudent', false, postObj, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          console.log(res);
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });


  }

}
