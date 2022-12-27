import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { MasterService } from 'src/app/core/services/master.service';


@Component({
  selector: 'app-add-update-teacher-registration',
  templateUrl: './add-update-teacher-registration.component.html',
  styleUrls: ['./add-update-teacher-registration.component.scss']
})
export class AddUpdateTeacherRegistrationComponent {
  teacherRegForm!: FormGroup;
  editFlag: boolean = false;
  editObj: any;
  uploadImg: any;
  showAddRemImg: boolean = false;
  genderArray = new Array();
  districtArray = new Array();
  talukaArray = new Array();
  villageArray = new Array();
  schoolArray = new Array();
  clusterArray = new Array();
  designationArray = new Array();
  GradateTeacherSubjectArray = new Array();
  payScaleArray = new Array();
  casteArray = new Array();
  twelveBranchArray = new Array();
  optionalSubjectArray = new Array();
  degreeUniversityArray = new Array();
  educationQualificationArray = new Array();
  profesionalQualificationArray = new Array();
  castCategoryArray = new Array();
  casteVerification = new Array();
  husbandWifeBothServiceArray = new Array();
  AreyouDisabled = new Array();
  interDistrictTransferredArray = new Array();
  haveYouPassedComputerExamArray = new Array();
  isGraduatePayScaleArray = new Array();
  interDistrictTransferTypeArray = new Array();
  assignClassArray = new Array();
  newAsssignClassArray=[
    {standardId :1 , checked:false},
    {standardId :2 , checked:false},
    {standardId :3 , checked:false},
    {standardId :4 , checked:false},
    {standardId :5 , checked:false},
    {standardId :6 , checked:false},
    {standardId :7 , checked:false},
    {standardId :8 , checked:false}
  ];


  constructor(private masterService: MasterService, private commonMethod: CommonMethodsService, private errorHandler: ErrorsService,
    private fileUpload: FileUploadService,
    private fb: FormBuilder, private service: ApiService, public dialogRef: MatDialogRef<AddUpdateTeacherRegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.formData();
    !this.data ? this.getGender() : this.onEdit(this.data);
  }

  get f() {
    return this.teacherRegForm.controls;
  }

  get teacherForm(): FormArray {
    return this.teacherRegForm.get('assignTeacher') as FormArray;
  }

  formData() {
    this.teacherRegForm = this.fb.group({
      "createdBy": 0,
      "modifiedBy": 0,
      "createdDate":  new Date(),
      "modifiedDate": new Date(),
      "isDeleted": false,
      "id": [this.data ? this.data.id : 0],
      "name": [this.data ? this.data.name : ''],
      "m_Name": [this.data ? this.data.m_Name : ''],
      "address": [this.data ? this.data.address : ''],
      "stateId": 0,
      "districtId": 0,
      "talukaId": 0,
      "villageId": 0,
      "centerId": 0,
      "userTypeId": 0,
      "subUserTypeId": 0,
      "genderId": 0,
      "mobileNo": [this.data ? this.data.mobileNo : ''],
      "emailId": [this.data ? this.data.emailId : ''],
      "birthDate": [this.data ? this.data.birthDate : ''],
      "age": [this.data ? this.data.age : 0],
      "uploadImage": [''],
      "currentAddress": [this.data ? this.data.currentAddress : ''],
      "permentAddress": [this.data ? this.data.permentAddress : ''],
      "lan": ['EN'],
      "localID": 0,
      "timestamp": new Date(),
      teacherDetails: this.fb.group({
        "createdBy": 0,
        "modifiedBy": 0,
        "createdDate": new Date(),
        "modifiedDate": new Date(),
        "isDeleted": false,
        "id": 0,
        "teacherId": 0,
        "districtId": 0,
        "talukaId": 0,
        "villageId": 0,
        "schoolId": 0,
        "clusterId": 0,
        "designationId": 0,
        "graduate_SubjectId": 0,
        "isGraduate_PayScale": true,
        "castId": 0,
        "castCategoryId": 0,
        "castCertificateNo": [this.data ? this.data.teacherDetails.castCertificateNo : ''],
        "castCertificateOffice": [this.data ? this.data.teacherDetails.castCertificateOffice : ''],
        "isCastVarificationDone": true,
        "castValidityNoDate": [this.data ? this.data.teacherDetails.castValidityNoDate : ''],
        "castverificationCommitteeName": [this.data ? this.data.teacherDetails.castverificationCommitteeName : ''],
        "dateOfFirstAppoinmentService":[this.data ? this.data.teacherDetails.dateOfFirstAppoinmentService : new Date()],
        "currentSchoolJoiningDate": [this.data ? this.data.teacherDetails.currentSchoolJoiningDate : new Date()],
        "currentTalukaPresentDate": [this.data ? this.data.teacherDetails.currentTalukaPresentDate : new Date()],
        "retirementDate":  [this.data ? this.data.teacherDetails.retirementDate : new Date()],
        "educationalQualificationId": 0,
        "branchId12th": 0,
        "degreeOptionalSubjectsId": 0,
        "degreeUniversityId": 0,
        "professionalQualificationId": 0,
        "bEdPercentages":[this.data ? this.data.teacherDetails.bEdPercentages : ''],
        "bEdUniversityId":[this.data ? this.data.teacherDetails.bEdUniversityId : ''],
        "husbandWife_Both_Service": true,
        "husbandWife_OfficeName": [this.data ? this.data.teacherDetails.husbandWife_OfficeName : ''],
        "isDisabled": true,
        "interDistrictTransferred": true,
        "dateOFPresenceInterDistrictTransfer": [this.data ? this.data.teacherDetails.dateOFPresenceInterDistrictTransfer : ''],
        "interDistrictTransferType": 0,
        "theOriginalDistrictInterDistrictTransfer":[this.data ? this.data.teacherDetails.theOriginalDistrictInterDistrictTransfer : ''],
        "dateOfSeniority": [this.data ? this.data.teacherDetails.dateOfSeniority : ''],
        "haveYouPassedComputerExam": true,
        "namesAndTalukasAllSchoolsWorkedEarlier": [this.data ? this.data.teacherDetails.namesAndTalukasAllSchoolsWorkedEarlier : '']
      }),
      "assignTeacher": []
    })

  }

  getClass(): FormGroup {
    return this.fb.group({
      "id": 0,
      "teacherId": 0,
      "standardId": 0,
      "isDeleted": true
    });
  }

  addStand(stand: any, value: number) {
    console.log(stand.currentTarget.checked);
    let data =
    {
      "id": 0,
      "teacherId": 0,
      "standardId": value,
      "isDeleted": true
    }

    if (stand.currentTarget.checked == true) {
      this.assignClassArray.push(data);
    }
    else {
      this.assignClassArray.pop();
    }
    console.log("assignClassArray",this.assignClassArray);
  }


  getGender() {
    this.masterService.getAllGender('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.genderArray = res.responseData;
          console.log("gender", this.genderArray);
          this.editFlag ? (this.teacherRegForm.controls['genderId'].setValue(this.editObj.genderID), this.getDistrict()) : this.getDistrict();
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
          // console.log("districtArray", this.districtArray);    
          this.editFlag ? (this.teacherRegForm.controls['districtId'].setValue(this.editObj.districtId), this.getTaluka()) : this.getTaluka();
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
          // console.log("talukaArray", this.talukaArray);  
          this.editFlag ? (this.teacherRegForm.controls['talukaId'].setValue(this.editObj.talukaId), this.getVillage()) : this.getVillage();
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getVillage() {
    // let talukaId = this.teacherRegForm.value.talukaId
    // console.log("fgdfg",talukaId);
    
    this.masterService.getAllVillage('EN', 1).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.villageArray = res.responseData;
          // console.log("villageArray", this.villageArray);            
          this.editFlag ? (this.teacherRegForm.controls['villageId'].setValue(this.editObj.villageId), this.getAllSchool()) :this.getAllSchool();
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }
  getAllSchool() {
    // let talukaId = this.teacherRegForm.value.talukaId;
    // let villageId =this.teacherRegForm.value.villageId;
    this.masterService.getAllSchoolByCriteria('EN', 1, 1, 0).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.schoolArray = res.responseData;
          // console.log("schoolArray", this.schoolArray); 
          if (this.editFlag) {
            this.teacherRegForm.patchValue({
              teacherDetails: {
                schoolId: this.editObj.teacherDetails?.schoolId
              }
            }),this.getCluster();

          }else{
            this.getCluster();
          }

          //  this.editFlag ? (this.teacherRegForm.controls['schoolId'].setValue(this.editObj.teacherDetails.schoolId),this.getCluster()) : '';
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
          // console.log("clusterArray", this.clusterArray);  
          if (this.editFlag) {
            this.teacherRegForm.patchValue({
              teacherDetails: {
                clusterId: this.editObj.teacherDetails?.clusterId
              }
            }),this.getDesignation();
          } else{
            this.getDesignation();
          }     
           this.editFlag ? (this.teacherRegForm.controls['clusterId']?.setValue(this.editObj.teacherDetails.clusterId), this.getDesignation()) : '';
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getDesignation() {
    this.masterService.GetDesignationByLevelId('EN', 0).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.designationArray = res.responseData;
          // console.log("designationArray", this.designationArray);  
          if (this.editFlag) {
            this.teacherRegForm.patchValue({
              teacherDetails: {
                designationId: this.editObj.teacherDetails?.designationId

              }
            }),this.getGraduateTeacherSubject();
          } else{
            this.getGraduateTeacherSubject();
          }         
          // this.editFlag ? (this.teacherRegForm.controls['districtId'].setValue(this.editObj.districtId), this.getGraduateTeacherSubject()) : '';
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
          // console.log("GradateTeacherSubjectArray", this.GradateTeacherSubjectArray);
          if (this.editFlag) {
            this.teacherRegForm.patchValue({
              teacherDetails: {
                graduate_SubjectId: this.editObj.teacherDetails?.graduate_SubjectId
              }
            }),this.getGraduatePayScale();
          }  else{
            this.getGraduatePayScale();
          }  
          // this.editFlag ? (this.teacherRegForm.controls['graduate_SubjectId'].setValue(this.editObj.graduate_SubjectId), this.getGraduatePayScale()) : '';

        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getGraduatePayScale() {
    this.isGraduatePayScaleArray = [
      { id: 1, name: 'yes', isGraduate_PayScale: true },
      { id: 2, name: 'no', isGraduate_PayScale: false }
    ];

    if (this.editFlag) {
      this.teacherRegForm.patchValue({
        teacherDetails: {
          isGraduate_PayScale: this.editObj.teacherDetails?.isGraduate_PayScale
        }
      }),this.getCaste();
    } else{
      this.getCaste();
    }
    // this.editFlag ? (this.teacherRegForm.controls['isGraduate_PayScale'].setValue(this.editObj.isGraduate_PayScale), this.getCaste()) : '';

  }

  getCaste() {
    this.masterService.getAllCaste('EN', 1).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.casteArray = res.responseData;
          // console.log("casteArray", this.casteArray); 
          if (this.editFlag) {
            this.teacherRegForm.patchValue({
              teacherDetails: {
                castId: this.editObj.teacherDetails?.castId
              }
            }),this.getCasteCategory();
          }else{
            this.getCasteCategory();
          }  
          // this.editFlag ? (this.teacherRegForm.controls['castId'].setValue(this.editObj.castId), this.getCasteCategory()) : '';
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getCasteCategory() {
    this.masterService.getCastCategoryDescById('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.castCategoryArray = res.responseData;
          // console.log("castCategoryArray", this.castCategoryArray); 
          if (this.editFlag) {
            this.teacherRegForm.patchValue({
              teacherDetails: {
                castCategoryId: this.editObj.teacherDetails?.castCategoryId
              }
            }),this.getCasteVerification();
          }  else{
            this.getCasteVerification();
          }  
          // this.editFlag ? (this.teacherRegForm.controls['castCategoryId'].setValue(this.editObj.castCategoryId), this.getCasteVerification()) : '';
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }
  getCasteVerification() {
    this.casteVerification = [
      { id: 1, name: 'yes', isCastVarificationDone: true },
      { id: 2, name: 'no', isCastVarificationDone: false }
    ];
    if (this.editFlag) {
      this.teacherRegForm.patchValue({
        teacherDetails: {
          isCastVarificationDone: this.editObj.teacherDetails?.isCastVarificationDone
        }
      }),this.getEducationQualification();
    } else{
      this.getEducationQualification();
    }
    // this.editFlag ? (this.teacherRegForm.controls['isCastVarificationDone'].setValue(this.editObj.isCastVarificationDone), this.getEducationQualification()) : '';
  }

  getEducationQualification() {
    this.masterService.getEducationalQualificationById('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.educationQualificationArray = res.responseData;
          // console.log("educationQualificationArray", this.educationQualificationArray);
          if (this.editFlag) {
            this.teacherRegForm.patchValue({
              teacherDetails: {
                educationalQualificationId: this.editObj.teacherDetails?.educationalQualificationId
              }
            }),this.getTwelveBranch();
          }else{
            this.getTwelveBranch();
          }  
          // this.editFlag ? (this.teacherRegForm.controls['educationalQualificationId'].setValue(this.editObj.educationalQualificationId), this.getTwelveBranch()) : '';
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getTwelveBranch() {
    this.masterService.getTwelveBranchCategoryDescById('EN',).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.twelveBranchArray = res.responseData;
          // console.log("twelveBranchArray", this.twelveBranchArray); 
          if (this.editFlag) {
            this.teacherRegForm.patchValue({
              teacherDetails: {
                branchId12th: this.editObj.teacherDetails?.branchId12th
              }
            }),this.getOptionalSubject();
          }else{
            this.getOptionalSubject();
          }  
          // this.editFlag ? (this.teacherRegForm.controls['branchId12th'].setValue(this.editObj.branchId12th), this.getOptionalSubject()) : '';
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
          // console.log("optionalSubjectArray", this.optionalSubjectArray); 
          if (this.editFlag) {
            this.teacherRegForm.patchValue({
              teacherDetails: {
                degreeOptionalSubjectsId: this.editObj.teacherDetails?.degreeOptionalSubjectsId
              }
            }),this.getDegreeUniversity();
          }  else{
            this.getDegreeUniversity();
          }
          // this.editFlag ? (this.teacherRegForm.controls['degreeOptionalSubjectsId'].setValue(this.editObj.degreeOptionalSubjectsId), this.getDegreeUniversity()) : '';
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
          // console.log("degreeUniversityArray", this.degreeUniversityArray); 
          if (this.editFlag) {
            this.teacherRegForm.patchValue({
              teacherDetails: {
                degreeUniversityId: this.editObj.teacherDetails?.degreeUniversityId
              }
            }),this.getProfesionalQualification();
          }  else{
            this.getProfesionalQualification();
          }
          // this.editFlag ? (this.teacherRegForm.controls['degreeUniversityId'].setValue(this.editObj.degreeUniversityId), this.getProfesionalQualification()) : '';
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getProfesionalQualification() {
    this.masterService.getProfessinalQualificationById('EN',).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.profesionalQualificationArray = res.responseData;
          // console.log("profesionalQualificationArray", this.profesionalQualificationArray);
          if (this.editFlag) {
            this.teacherRegForm.patchValue({
              teacherDetails: {
                professionalQualificationId: this.editObj.teacherDetails?.professionalQualificationId
              }
            }),this.gethusbandWifeBothService();
          } else{
            this.gethusbandWifeBothService();
          } 
          // this.editFlag ? (this.teacherRegForm.controls['professionalQualificationId'].setValue(this.editObj.professionalQualificationId), this.gethusbandWifeBothService()) : '';
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }


  gethusbandWifeBothService() {
    this.husbandWifeBothServiceArray = [
      { id: 1, name: 'yes', husbandWife_Both_Service: true },
      { id: 2, name: 'no', husbandWife_Both_Service: false }
    ];

    if (this.editFlag) {
      this.teacherRegForm.patchValue({
        teacherDetails: {
          husbandWife_Both_Service: this.editObj.teacherDetails?.husbandWife_Both_Service
        }
      }),this.getAreyouDisabled();
    }  else{
      this.getAreyouDisabled();
    }

    // this.editFlag ? (this.teacherRegForm.controls['husbandWife_Both_Service'].setValue(this.editObj.husbandWife_Both_Service), this.getAreyouDisabled()) : '';
  }
  getAreyouDisabled() {
    this.AreyouDisabled = [
      { id: 1, name: 'yes', isDisabled: true },
      { id: 2, name: 'no', isDisabled: false }
    ];

    if (this.editFlag) {
      this.teacherRegForm.patchValue({
        teacherDetails: {
          isDisabled: this.editObj.teacherDetails?.isDisabled
        }
      }),this.getInterDistrictTransferred();
    }  else{
      this.getInterDistrictTransferred();
    }

    // this.editFlag ? (this.teacherRegForm.controls['isDisabled'].setValue(this.editObj.isDisabled), this.getInterDistrictTransferred()) : '';
  }

  getInterDistrictTransferred() {
    this.interDistrictTransferredArray = [
      { id: 1, name: 'yes', interDistrictTransferred: true },
      { id: 2, name: 'no', interDistrictTransferred: false }
    ];

    if (this.editFlag) {
      this.teacherRegForm.patchValue({
        teacherDetails: {
          interDistrictTransferred: this.editObj.teacherDetails?.interDistrictTransferred
        }
      }),this.GetInterDistrictTransferType();
    } else{
      this.GetInterDistrictTransferType();
    } 
    // this.editFlag ? (this.teacherRegForm.controls['interDistrictTransferred'].setValue(this.editObj.interDistrictTransferred), this.GetInterDistrictTransferType()) : '';
  }

  GetInterDistrictTransferType() {
    this.masterService.getAllInterDistrictTransferType('EN',).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.interDistrictTransferTypeArray = res.responseData;
          console.log("interDistrictTransferTypeArray", this.interDistrictTransferTypeArray); 
          if (this.editFlag) {
            this.teacherRegForm.patchValue({
              teacherDetails: {
                interDistrictTransferType: this.editObj.teacherDetails?.interDistrictTransferType
              }
            }),this.getHaveYouPassedComputerExam();
          }  else{
            this.getHaveYouPassedComputerExam();
          }   
          // this.editFlag ? (this.teacherRegForm.controls['interDistrictTransferType'].setValue(this.editObj.interDistrictTransferType), this.getHaveYouPassedComputerExam()) : '';
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getHaveYouPassedComputerExam() {
    this.haveYouPassedComputerExamArray = [
      { id: 1, name: 'yes', haveYouPassedComputerExam: true },
      { id: 2, name: 'no', haveYouPassedComputerExam: false }
    ];
    if (this.editFlag) {
      this.teacherRegForm.patchValue({
        teacherDetails: {
          haveYouPassedComputerExam: this.editObj.teacherDetails?.haveYouPassedComputerExam
        }
      })
    }     
  }

  imgUpload(event: any) {
    this.fileUpload.uploadDocuments(event, 'Upload', 'jpg, jpeg, png').subscribe((res: any) => {
      this.uploadImg = res.responseData;
      this.showAddRemImg = true;
    });
  }

  OnSubmit() {
    console.log(this.teacherRegForm.value);
    let formValue = this.teacherRegForm.value;
    formValue.uploadImage ? formValue.uploadImage = this.uploadImg : '';
    !this.showAddRemImg ? formValue.uploadImage = '' : formValue.uploadImage = formValue.uploadImage;
    this.teacherRegForm.value.assignTeacher = this.assignClassArray;
    let postObj = this.teacherRegForm.value;
    console.log(postObj);
    let url;
    this.editFlag ? url = 'zp_osmanabad/Teacher/Update' : url = 'zp_osmanabad/Teacher/Add'
    this.service.setHttp(this.editFlag ? 'put' : 'post', url, false, postObj, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        // this.ngxSpinner.hide();
        if (res.statusCode == '200') {
          this.dialogRef.close('yes');
        } else {
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        // this.ngxSpinner.hide();
        this.commonMethod.checkEmptyData(error.statusMessage) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
      }
    })
  }

  onEdit(obj: any) {
    this.editFlag = true;
    this.editObj = obj;
    console.log("editObj", this.editObj);
    // return
    this.data.uploadImage ? this.teacherRegForm.value.uploadImage = this.data.uploadImage : '';
    this.data.uploadImage ? this.showAddRemImg = true : this.showAddRemImg = false;
    this.formData(); this.getGender();
  }

  clearImg() {
  
    this.teacherRegForm.value.uploadImage = '';
    this.f['uploadImage'].setValue('');
    this.showAddRemImg = false;
  }
  viewImg(){
    window.open(this.uploadImg, 'blank');
  }

}
