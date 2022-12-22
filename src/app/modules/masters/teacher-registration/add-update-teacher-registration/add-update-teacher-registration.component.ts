import { Component, Inject } from '@angular/core';
import {  FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';


@Component({
  selector: 'app-add-update-teacher-registration',
  templateUrl: './add-update-teacher-registration.component.html',
  styleUrls: ['./add-update-teacher-registration.component.scss']
})
export class AddUpdateTeacherRegistrationComponent {

  teacherRegForm!:FormGroup;
  genderArray = new Array();
  districtArray = new Array();
  talukaArray = new Array();
  villageArray =new Array();
  clusterArray  =new Array();
  designationArray = new Array();
  GradateTeacherSubjectArray = new Array();
  payScaleArray = new Array();
  twelveBranchArray  = new Array();
  optionalSubjectArray = new Array();
  degreeUniversityArray = new Array();

  constructor(private masterService :MasterService, private commonMethod :CommonMethodsService, private errorHandler :ErrorsService,
   private fb : FormBuilder, public dialogRef: MatDialogRef<AddUpdateTeacherRegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.formData();
    //  this.getGender();
  }

  get itemsForm(): FormArray {
    return this.teacherRegForm.get('teacherDetails') as FormArray;
  }

  formData(){
    this.teacherRegForm =this.fb.group({            
        "createdBy": 0,
        "modifiedBy": 0,
        "createdDate": "2022-12-22T06:44:26.229Z",
        "modifiedDate": "2022-12-22T06:44:26.229Z",
        "isDeleted": true,
        "id": 0,
        "name": "string",
        "m_Name": "string",
        "address": "string",
        "stateId": 0,
        "districtId": 0,
        "talukaId": 0,
        "villageId": 0,
        "centerId": 0,
        "userTypeId": 0,
        "subUserTypeId": 0,
        "genderId": 0,
        "mobileNo": "string",
        "emailId": "string",
        "birthDate": "2022-12-22T06:44:26.229Z",
        "age": 0,
        "currentAddress": "string",
        "permentAddress": "string",
        "lan": "string",
        "localID": 0,
        "timestamp": "2022-12-22T06:44:26.230Z",
        teacherDetails: this.fb.array([
          this.fb.group({
            "createdBy": 0,
            "modifiedBy": 0,
            "createdDate": "2022-12-22T06:44:26.230Z",
            "modifiedDate": "2022-12-22T06:44:26.230Z",
            "isDeleted": true,
            "id": 0,
            "teacherId": 0,
            "schoolId": 0,
            "clusterId": 0,
            "designationId": 0,
            "graduate_SubjectId": 0,
            "isGraduate_PayScale": true,
            "castId": 0,
            "castCategoryId": 0,
            "castCertificateNo": "string",
            "castCertificateOffice": "string",
            "isCastVarificationDone": true,
            "castValidityNoDate": "string",
            "castverificationCommitteeName": "string",
            "dateOfFirstAppoinmentService": "2022-12-22T06:44:26.230Z",
            "currentSchoolJoiningDate": "2022-12-22T06:44:26.230Z",
            "currentTalukaPresentDate": "2022-12-22T06:44:26.230Z",
            "retirementDate": "2022-12-22T06:44:26.230Z",
            "educationalQualificationId": 0,
            "branchId12th": 0,
            "degreeOptionalSubjectsId": 0,
            "degreeUniversityId": 0,
            "professionalQualificationId": 0,
            "bEdPercentages": 0,
            "bEdUniversityId": 0,
            "husbandWife_Both_Service": true,
            "husbandWife_OfficeName": "string",
            "isDisabled": true,
            "interDistrictTransferred": true,
            "dateOFPresenceInterDistrictTransfer": "string",
            "interDistrictTransferType": 0,
            "theOriginalDistrictInterDistrictTransfer": 0,
            "dateOfSeniority": "string",
            "haveYouPassedComputerExam": true,
            "namesAndTalukasAllSchoolsWorkedEarlier": "string"
          })
        ]),
        "teacherDocument": [
          {
            "createdBy": 0,
            "modifiedBy": 0,
            "createdDate": "2022-12-22T06:44:26.230Z",
            "modifiedDate": "2022-12-22T06:44:26.230Z",
            "isDeleted": true,
            "id": 0,
            "teacherId": 0,
            "documentId": 0,
            "docPath": "string"
          }
        ]
      

    })
  }

  getGender() { 
    this.masterService.getAllGender('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.genderArray = res.responseData;
          console.log("gender", this.genderArray); 
          this.getDistrict();        
          
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getDistrict() { 
    this.masterService.getAllDistrict('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.districtArray = res.responseData;
          console.log("districtArray", this.districtArray);         
          this.getTaluka();
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getTaluka() { 
    this.masterService.getAllTaluka('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.talukaArray = res.responseData;
          console.log("talukaArray", this.talukaArray);         
          this.getVillage();
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getVillage() { 
    this.masterService.getAllTaluka('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.villageArray = res.responseData;
          console.log("villageArray", this.villageArray);   
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getCluster() { 
    this.masterService.getClusterCategoryDescById('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.clusterArray = res.responseData;
          console.log("clusterArray", this.clusterArray);   
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

   getDesignation() { 
    this.masterService.GetDesignationByLevelId('EN',0).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.designationArray = res.responseData;
          console.log("designationArray", this.designationArray);   
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

     getGraduateTeacherSubject() { 
    this.masterService.getAllSubject('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.GradateTeacherSubjectArray = res.responseData;
          console.log("GradateTeacherSubjectArray", this.GradateTeacherSubjectArray);   
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getGraduatepayScale() { 
    this.masterService.getPayscaleCategoryDescById('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.payScaleArray = res.responseData;
          console.log("GradateTeacherSubjectArray", this.GradateTeacherSubjectArray);   
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getCaste() { 
    this.masterService.getAllCaste('EN',1).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.payScaleArray = res.responseData;
          console.log("GradateTeacherSubjectArray", this.GradateTeacherSubjectArray);   
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  
  // getCasteCategory() { 
  //   this.masterService.getAllCaste('EN',1).subscribe({
  //     next: ((res: any) => {
  //       if (res.statusCode == '200' && res.responseData.length) {
  //         this.castCategoryArray = res.responseData;
  //         console.log("GradateTeacherSubjectArray", this.GradateTeacherSubjectArray);   
  //       }
  //     }), error: (error: any) => {
  //       this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
  //     }
  //   })
  // }

  // getEducationQualification() { 
  //   this.masterService.getAllCaste('EN',1).subscribe({
  //     next: ((res: any) => {
  //       if (res.statusCode == '200' && res.responseData.length) {
  //         this.payScaleArray = res.responseData;
  //         console.log("GradateTeacherSubjectArray", this.GradateTeacherSubjectArray);   
  //       }
  //     }), error: (error: any) => {
  //       this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
  //     }
  //   })
  // }

  getTwelveBranch() { 
    this.masterService.getTwelveBranchCategoryDescById('EN',).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.twelveBranchArray = res.responseData;
          console.log("twelveBranchArray", this.twelveBranchArray);   
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getOptionalSubject() { 
    this.masterService.getOptionalSubjectCategoryDescById('EN',).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.optionalSubjectArray = res.responseData;
          console.log("optionalSubjectArray", this.optionalSubjectArray);   
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getDegreeUniversity() { 
    this.masterService.getUniversityCategoryDescById('EN',).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.degreeUniversityArray = res.responseData;
          console.log("degreeUniversityArray", this.degreeUniversityArray);   
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  // getProfesionalQualification() { 
  //   this.masterService.getUniversityCategoryDescById('EN',).subscribe({
  //     next: ((res: any) => {
  //       if (res.statusCode == '200' && res.responseData.length) {
  //         this.degreeUniversityArray = res.responseData;
  //         console.log("degreeUniversityArray", this.degreeUniversityArray);   
  //       }
  //     }), error: (error: any) => {
  //       this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
  //     }
  //   })
  // }


  OnSubmit(){

  }
}
