import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    private commonMethods: CommonMethodsService,
    public validators : ValidationService,
    public dialogRef: MatDialogRef<AddUpdateStudentRegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.languageFlag = this.webService.languageFlag;
    this.formData(),
      this.data ? (this.editObj = this.data, this.patchValue()) : (
        this.getDistrict(),
        this.getTaluka(),
        this.getCenter(),
        this.getSchool(),
        this.getGender(),
        this.getReligion(),
        this.getStandard()
      )
  }

  formData() {
    this.stuRegistrationForm = this.fb.group({
      districtId: [{ value: 1, disabled: true }],
      talukaId: ['',Validators.required],
      centerId: ['',Validators.required],
      schoolId: ['',Validators.required],
      fName: ['',Validators.required], 
      mName: ['',Validators.required],
      lName: ['',Validators.required],
      f_MName: ['',Validators.required], 
      m_MName: ['',Validators.required],
      l_MName: ['',Validators.required],
      standard: ['',Validators.required],
      dob: ['',Validators.required],
      gender: ['',Validators.required],
      religionId: ['',Validators.required],
      castId: ['',Validators.required],
      saralId: ['',Validators.required],
      mobileNo: ['',[Validators.required,Validators.pattern(this.validators.mobile_No)]],
      fatherFullName: ['',Validators.required], 
      m_FatherFullName: ['',Validators.required], 
      motherName: ['',Validators.required],
      m_MotherName: ['',Validators.required],
      aadharNo: ['',[Validators.required,Validators.pattern(this.validators.aadhar_card)]],
      // emailID:[''],
      physicallyDisabled: ['',Validators.required],
      photo:[''],
      aadharPhoto:['']

    })
  }

  get fc() { return this.stuRegistrationForm.controls }

  getDistrict() {
    this.masterService.getAllDistrict(this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.districtArr = res.responseData;
          this.stuRegistrationForm.controls['districtId'].setValue(1);
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
          this.editObj ? this.stuRegistrationForm.controls['standard'].setValue(this.editObj.standardId) : '';
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
          this.editObj ? this.stuRegistrationForm.controls['gender'].setValue(this.editObj.genderId) : '';
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
          this.editObj ? (this.stuRegistrationForm.controls['religionId'].setValue(this.editObj.religionId), this.getCaste()) : '';
        } else {
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
          this.casteArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  fileUpload(event: any, name: string) {
    this.fileUpl.uploadDocuments(event, 'Upload', 'jpg, jpeg, png').subscribe((res: any) => {
      name == 'img' ? (this.uploadImg = res.responseData,this.stuRegistrationForm.controls['photo'].setValue(this.uploadImg.split('/').pop())) : (
        this.uploadAadhar = res.responseData,this.stuRegistrationForm.controls['aadharPhoto'].setValue(this.uploadAadhar.split('/').pop()) );
    });
  }

  patchValue() {
    this.editFlag = true;
    console.log(this.editObj);    
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
      m_FatherFullName: this.editObj?.gaurdianResponse[0]?.m_FatherFullName,
      motherName: this.editObj?.gaurdianResponse[0]?.motherName,
      m_MotherName: this.editObj?.gaurdianResponse[0]?.m_MotherName,
      aadharNo: this.editObj?.aadharNo,
      dob: new Date(this.editObj?.dob.split(' ')[0]),
      physicallyDisabled: this.editObj?.isHandicaped ? 1 : 2
    });
    this.uploadAadhar = this.editObj.documentResponse[1]?.docPath;
    this.uploadImg = this.editObj.documentResponse[0]?.docPath;
    this.getDistrict();
    this.getTaluka();
    this.getCenter();
    this.getSchool();
    this.getGender();
    this.getReligion();
    this.getStandard();

  }

  onSubmit() {
    let obj = this.stuRegistrationForm.value;
    let postObj = {
      "createdBy": 0,
      "modifiedBy": 0,
      "createdDate": "2022-12-21T07:11:24.503Z",
      "modifiedDate": "2022-12-21T07:11:24.503Z",
      "isDeleted": true,
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
        "studentId": this.editFlag ? this.editObj.id : 0,
        "fatherFullName": obj.fatherFullName || '',
        "m_FatherFullName": obj.m_FatherFullName || '',
        "motherName": obj.motherName || '',
        "m_MotherName": obj.m_MotherName || '',
        "mobileNo": obj.mobileNo
      },
      "documentModel": [
        {
          "id": 0,
          "studentId": this.editFlag ? this.editObj.id : 0,
          "documentId": 1,
          "docPath": this.uploadImg || ''
        },
        {
          "id": 0,
          "studentId": this.editFlag ? this.editObj.id : 0,
          "documentId": 2,
          "docPath": this.uploadAadhar || ''
        }
      ],
      "lan": "string"
    }

    if(this.stuRegistrationForm.invalid){
      return
    }else{
      console.log(postObj);
      
      let url = this.editFlag ? 'UpdateStudent' : 'AddStudent'
      this.apiService.setHttp(this.editFlag ? 'put' : 'post', 'zp-osmanabad/Student/' + url, false, postObj, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode == "200") {
            this.commonMethods.snackBar(res.statusMessage,0);
            this.dialogRef.close('yes')
          }else{
            this.commonMethods.snackBar(res.statusMessage,1);
          }
        },
        error: ((err: any) => { this.errors.handelError(err) })
      });
    }
  }
  clearForm(clear:any){
    clear.resetForm();   
  }

}
