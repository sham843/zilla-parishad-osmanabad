import { Component, Inject } from '@angular/core';
import {  FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(private masterService :MasterService, private commonMethod :CommonMethodsService, private errorHandler :ErrorsService,
   private fb : FormBuilder, public dialogRef: MatDialogRef<AddUpdateTeacherRegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.formData();
    // this.getGender();
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
        "teacherDetails": [
          {
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
          }
        ],
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
          
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }





  OnSubmit(){

  }
}
