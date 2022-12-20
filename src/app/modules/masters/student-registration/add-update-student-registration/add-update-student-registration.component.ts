import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { MasterService } from 'src/app/core/services/master.service';

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

  @ViewChild('uploadImage') imageFile!: ElementRef;
  @ViewChild('uploadAadhar') aadharFile!: ElementRef;
  uploadImg: any;
  uploadAadhar: any;

  editObj: any

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private errors: ErrorsService,
    private fileUpl: FileUploadService,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AddUpdateStudentRegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
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
      fullName: [''],
      standard: [''],
      dob: [''],
      gender: [''],
      religionId: [''],
      castId: [''],
      saralId: [''],
      mobileNo: [''],
      fatherFullName: [''],
      motherName: [''],
      // emailID:[''],
      physicallyDisabled: ['']

    })
  }

  getDistrict() {
    this.masterService.getAllDistrict('EN').subscribe({
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
    this.masterService.getAllTaluka('EN').subscribe({
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
    this.masterService.getAllCenter('EN').subscribe({
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
    this.masterService.getAllSchoolType('EN').subscribe({
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
    this.masterService.getAllStandard('EN').subscribe({
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
    this.masterService.getAllGender('EN').subscribe({
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
    this.masterService.getAllReligion('EN').subscribe({
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
    this.masterService.getAllCaste('EN').subscribe({
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
      dob : this.editObj.dob.split('T')[0]
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
      "createdDate": "2022-12-19T07:08:17.290Z",
      "modifiedDate": "2022-12-19T07:08:17.290Z",
      "isDeleted": true,
      "id": 0,
      "fullName": obj.fullName,
      "m_FullName": "",
      "stateId": 0,
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
      "gaurdianModel": {
        "id": 0,
        "studentId": 0,
        "fatherFullName": obj.fatherFullName,
        "m_FatherFullName": "",
        "motherName": obj.motherName,
        "m_MotherName": "",
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

    this.apiService.setHttp('post', 'ZP-Osmanabad/School/Add', false, postObj, false, 'baseUrl');
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
