import { Component, Inject } from '@angular/core';
import {  FormArray, FormBuilder, FormGroup } from '@angular/forms';
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

  teacherRegForm!:FormGroup;
  editFlag:boolean=false;
  editObj:any;
  uploadImg:any;
  showAddRemImg:boolean=false;
  genderArray = new Array();
  districtArray = new Array();
  talukaArray = new Array();
  villageArray =new Array();
  schoolArray = new Array();
  clusterArray  =new Array();
  designationArray = new Array();
  GradateTeacherSubjectArray = new Array();
  payScaleArray = new Array();
  casteArray = new Array();
  twelveBranchArray  = new Array();
  optionalSubjectArray = new Array();
  degreeUniversityArray = new Array();
  educationQualificationArray = new Array();
  profesionalQualificationArray = new Array();
  castCategoryArray = new Array();
  casteVerification =new Array();
  husbandWifeBothServiceArray = new Array();
  AreyouDisabled =new Array();
  interDistrictTransferredArray = new Array();
  haveYouPassedComputerExamArray = new Array();
  isGraduatePayScaleArray = new Array();  
 

  constructor(private masterService :MasterService, private commonMethod :CommonMethodsService, private errorHandler :ErrorsService,
    private fileUpload: FileUploadService,
   private fb : FormBuilder,private service: ApiService, public dialogRef: MatDialogRef<AddUpdateTeacherRegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.formData();
     !this.data ? this.getGender():this.onEdit(this.data);
  }

  get f() {
    return this.teacherRegForm.controls;
  }

  get itemsForm(): FormArray {
    return this.teacherRegForm.get('teacherDetails') as FormArray;
  }

  formData(){
    this.teacherRegForm =this.fb.group({            
        "createdBy": 0,
        "modifiedBy": 0,
        "createdDate": new Date(),
        "modifiedDate": new Date(),
        "isDeleted": true,
        "id": 0,
        "name": [''],
        "m_Name": [''],
        "address": [''],
        "stateId": 0,
        "districtId": 0,
        "talukaId": 0,
        "villageId": 0,
        "centerId": 0,
        "userTypeId": 0,
        "subUserTypeId": 0,
        "genderId": 0,
        "mobileNo": [''],
        "emailId": [''],
        "birthDate": new Date(),
        "age": 0,
        "currentAddress": [''],
        "permentAddress": [''],
        "lan": [''],
        "localID": 0,
        "timestamp": new Date(),
        teacherDetails: this.fb.array([
          this.fb.group({
            "createdBy": 0,
            "modifiedBy": 0,
            "createdDate": new Date(),
            "modifiedDate": new Date(),
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
            "castCertificateNo": [''],
            "castCertificateOffice": [''],
            "isCastVarificationDone": true,
            "castValidityNoDate": [''],
            "castverificationCommitteeName": [''],
            "dateOfFirstAppoinmentService": new Date(),
            "currentSchoolJoiningDate": new Date(),
            "currentTalukaPresentDate": new Date(),
            "retirementDate": new Date(),
            "educationalQualificationId": 0,
            "branchId12th": 0,
            "degreeOptionalSubjectsId": 0,
            "degreeUniversityId": 0,
            "professionalQualificationId": 0,
            "bEdPercentages": 0,
            "bEdUniversityId": 0,
            "husbandWife_Both_Service": true,
            "husbandWife_OfficeName": [''],
            "isDisabled": true,
            "interDistrictTransferred": true,
            "dateOFPresenceInterDistrictTransfer": [''],
            "interDistrictTransferType": 0,
            "theOriginalDistrictInterDistrictTransfer": 0,
            "dateOfSeniority": [''],
            "haveYouPassedComputerExam": true,
            "namesAndTalukasAllSchoolsWorkedEarlier": ['']
          })
        ]),
        "teacherDocument": [
          {
            "createdBy": 0,
            "modifiedBy": 0,
            "createdDate": new Date(),
            "modifiedDate": new Date(),
            "isDeleted": true,
            "id": 0,
            "teacherId": 0,
            "documentId": 0,
            "docPath": ['']
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
    this.masterService.getAllVillage('EN',0).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.villageArray = res.responseData;
          console.log("villageArray", this.villageArray);  
          this.getAllSchool(); 
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }
  getAllSchool() { 
    this.masterService.getAllSchoolByCriteria('EN',0,0,0).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.schoolArray = res.responseData;
          console.log("schoolArray", this.schoolArray);
          this.getCluster();
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
          this.getDesignation();
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
          this.getGraduateTeacherSubject();
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
          this.getGraduatePayScale();
          
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
    this.getCaste();
  }

  getCaste() { 
    this.masterService.getAllCaste('EN',1).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.casteArray = res.responseData;
          console.log("casteArray", this.casteArray);  
          this.getCasteCategory(); 
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
          console.log("castCategoryArray", this.castCategoryArray);   
          this.getEducationQualification(); 
          this.getCasteVerification();
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }
  getCasteVerification(){
    return  this.casteVerification=[{id : 1 ,name :'yes' , isCastVarificationDone :true},{id : 2 ,name :'no' , isCastVarificationDone :false}] ;
  }

  getEducationQualification() { 
    this.masterService.getEducationalQualificationById('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.educationQualificationArray = res.responseData;
          console.log("educationQualificationArray", this.educationQualificationArray); 
          this.getTwelveBranch();   
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
          console.log("twelveBranchArray", this.twelveBranchArray); 
          this.getOptionalSubject();
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
          this.getDegreeUniversity();  
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
          this.getProfesionalQualification();   
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
          console.log("profesionalQualificationArray", this.profesionalQualificationArray);
          this.gethusbandWifeBothService();   
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }
  gethusbandWifeBothService(){
      this.husbandWifeBothServiceArray=[
        {id : 1 ,name :'yes' , husbandWife_Both_Service :true},
        {id : 2 ,name :'no' , husbandWife_Both_Service :false}
      ];
      this.getAreyouDisabled();
  }
  getAreyouDisabled(){
    this.AreyouDisabled=[
      {id : 1 ,name :'yes' , isDisabled :true},
      {id : 2 ,name :'no' , isDisabled :false}
    ];
    this.getInterDistrictTransferred();
  }

  getInterDistrictTransferred(){
  this.interDistrictTransferredArray=[
    {id : 1 ,name :'yes' , interDistrictTransferred :true},
    {id : 2 ,name :'no' , interDistrictTransferred :false}
  ];
  this.getHaveYouPassedComputerExam();
  }

getHaveYouPassedComputerExam(){
   this. haveYouPassedComputerExamArray=[
    {id : 1 ,name :'yes' , haveYouPassedComputerExam :true},
    {id : 2 ,name :'no' , haveYouPassedComputerExam :false}
  ];
}


imgUpload(event: any) {
  this.fileUpload.uploadDocuments(event, 'Upload', 'jpg, jpeg, png').subscribe((res: any) => {
    this.uploadImg = res.responseData;
    this.showAddRemImg = true;
  });
}



  OnSubmit(){
    console.log(this.teacherRegForm.value);
    let formValue = this.teacherRegForm.value
    return;
    formValue.docPath ? formValue.docPath = this.uploadImg : '';
      !this.showAddRemImg ? formValue.docPath = '' : formValue.docPath = formValue.docPath;
    let postObj = this.teacherRegForm.value;
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

  onEdit(obj:any){
    this.editFlag =true;
    this.editObj = obj;
    console.log("editObj",this.editObj);
    return
    this.data.docPath ? this.teacherRegForm.value.docPath = this.data.docPath : '';
    
    this.data.docPath ? this.showAddRemImg = true :  this.showAddRemImg = false;
   this.formData();
    
  }

  clearImg(){
    return
    this.teacherRegForm.value.docPath = '';
    this.f['docPath'].setValue('');
    this.showAddRemImg = false;
  }
}
