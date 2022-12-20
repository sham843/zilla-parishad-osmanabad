import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  @ViewChild('uploadImage') imageFile!: ElementRef;
  @ViewChild('uploadAadhar') aadharFile!: ElementRef;
  uploadImg: any;
  uploadAadhar: any;

  constructor(
    private fb : FormBuilder,
    private masterService: MasterService,
    private errors: ErrorsService,
    private fileUpl: FileUploadService,) { }

  ngOnInit() {
    this.formData();
    this.getDistrict();
    this.getTaluka();
    this.getCenter();
    this.getSchool();
    this.getGender();
    this.getReligion();
    this.getStandard();
  }

  formData(){
    this.stuRegistrationForm = this.fb.group({
      districtId:[''],
      talukaId:[''],
      centerId:[''],
      schoolId:[''],
      fullName:[''],
      standard:[''],
      dob:[''],
      gender:[''],
      religionId:[''],
      castId:[''],
      saralId:[''],
      mobileNo:[''],
      fatherFullName:[''],
      motherName:[''],
      emailID:['']

    })
  }

  getDistrict() {
    this.masterService.getAllDistrict('EN').subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.districtArr = res.responseData;          
        }else{
          this.districtArr =[];
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
        }else{
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
        }else{
          this.centerArr =[];
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
        }else{
          this.schoolArr =[];
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
        }else{
          this.standardArr =[];
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
        }else{
          this.genderArr =[];
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
        }else{
          this.religionArr =[];
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  fileUpload(event:any,name:string){
  console.log(event);
   this.fileUpl.uploadDocuments(event, 'Upload', 'jpg, jpeg, png').subscribe((res: any) => {
    name == 'img' ? this.uploadImg = res.responseData : this.uploadAadhar = res.responseData;    
  });

  }

  onSubmit(){
    let obj = this.stuRegistrationForm.value;
    let postObj = {
      "createdBy": 0,
      "modifiedBy": 0,
      "createdDate": "2022-12-19T07:08:17.290Z",
      "modifiedDate": "2022-12-19T07:08:17.290Z",
      "isDeleted": true,
      "id": 0,
      "fullName": obj.fullName,
      "m_FullName": "string",
      "stateId": 0,
      "districtId": obj.districtId,
      "talukaId": obj.talukaId,
      "centerId": obj.centerId,
      "schoolId": obj.schoolId,
      "standard": obj.standard,
      "saralId": obj.saralId,
      "gender": obj.gender,
      "dob": obj.dob,
      "religionId":  obj.religionId,
      "castId": obj.castId,
      "gaurdianModel": {
        "id": 0,
        "studentId": 0,
        "fatherFullName": obj.fatherFullName,
        "m_FatherFullName": "string",
        "motherName":obj.motherName,
        "m_MotherName": "string",
        "mobileNo": obj.mobileNo
      },
      "documentModel": [
        {
          "id": 0,
          "studentId": 0,
          "documentId": 0,
          "docPath": "string"
        }
      ],
      "lan": "string"
    }

    console.log(postObj);
    
    
  }

}
