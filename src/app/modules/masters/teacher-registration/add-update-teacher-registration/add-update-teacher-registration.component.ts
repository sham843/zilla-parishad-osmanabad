import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';


@Component({
  selector: 'app-add-update-teacher-registration',
  templateUrl: './add-update-teacher-registration.component.html',
  styleUrls: ['./add-update-teacher-registration.component.scss']
})
export class AddUpdateTeacherRegistrationComponent {
  teacherRegForm!: FormGroup;
  editFlag: boolean = false;
  assignclass:boolean =false;
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
  img:boolean=false;

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
    private fileUpload: FileUploadService,public validation: ValidationService,
    private fb: FormBuilder, private service: ApiService, public dialogRef: MatDialogRef<AddUpdateTeacherRegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.formData();
    !this.data ? this.getGender() : this.onEdit(this.data);
  }

  get f() {
    return this.teacherRegForm.controls;
  }

  get td(){
    // return this.teacherRegForm.get('teacherDetails') as FormGroup .controls;
    return ((this.teacherRegForm.get('teacherDetails') as FormGroup).controls)

  }

  // get teacherForm() {
  //   return this.teacherRegForm.get('teacherDetails') as object;
  // }

  formData() {
    this.teacherRegForm = this.fb.group({
      "createdBy": 0,
      "modifiedBy": 0,
      "createdDate":  new Date(),
      "modifiedDate": new Date(),
      "isDeleted": false,
      "id": [this.data ? this.data.id : 0],
      "name": [this.data ? this.data.name : '',[Validators.required, Validators.pattern(this.validation.fullName)]],
      "m_Name": [this.data ? this.data.m_Name : '',Validators.required],
      "address": [''],
      "stateId": 0,
      "districtId": ['', Validators.required],
      "talukaId": ['', Validators.required],
      "villageId":['', Validators.required],
      "centerId": 0,
      "userTypeId": 0,
      "subUserTypeId": 0,
      "genderId": ['', Validators.required],
      "mobileNo": [this.data ? this.data.mobileNo : '',[Validators.required, Validators.pattern(this.validation.mobile_No)]],
      "emailId": [this.data ? this.data.emailId : '',Validators.pattern(this.validation.email)],
      "birthDate": [this.data ? this.data.birthDate : '',Validators.required],
      "age": [this.data ? this.data.age : 0],
      "uploadImage": [''],
      "currentAddress": [this.data ? this.data.currentAddress : '',[Validators.required, Validators.pattern(this.validation.fullName)]],
      "permentAddress": [this.data ? this.data.permentAddress : '',[Validators.required, Validators.pattern(this.validation.fullName)]],
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
        "schoolId": ['',Validators.required],
        "clusterId": ['',Validators.required],
        "designationId":['',Validators.required],
        "graduate_SubjectId": ['',Validators.required],
        "isGraduate_PayScale": ['',Validators.required],
        "castId":['',Validators.required],
        "castCategoryId": ['',Validators.required],
        "castCertificateNo": [this.data ? this.data.teacherDetails.castCertificateNo : '',Validators.required],
        "castCertificateOffice": [this.data ? this.data.teacherDetails.castCertificateOffice : '',Validators.required],
        "isCastVarificationDone": ['',Validators.required],
        "castValidityNoDate": [this.data ? this.data.teacherDetails.castValidityNoDate : '',Validators.required],
        "castverificationCommitteeName": [this.data ? this.data.teacherDetails.castverificationCommitteeName : '',Validators.required],
        "dateOfFirstAppoinmentService":[this.data ? this.data.teacherDetails.dateOfFirstAppoinmentService : '',Validators.required],
        "currentSchoolJoiningDate": [this.data ? this.data.teacherDetails.currentSchoolJoiningDate : '',Validators.required],
        "currentTalukaPresentDate": [this.data ? this.data.teacherDetails.currentTalukaPresentDate : '',Validators.required],
        "retirementDate":  [this.data ? this.data.teacherDetails.retirementDate : '',Validators.required],
        "educationalQualificationId": ['',Validators.required],
        "branchId12th": ['',Validators.required],
        "degreeOptionalSubjectsId": ['',Validators.required],
        "degreeUniversityId": ['',Validators.required],
        "professionalQualificationId": ['',Validators.required],
        "bEdPercentages":[this.data ? this.data.teacherDetails.bEdPercentages : ''],
        "bEdUniversityId":[this.data ? this.data.teacherDetails.bEdUniversityId : ''],
        "husbandWife_Both_Service":['',Validators.required],
        "husbandWife_OfficeName": [this.data ? this.data.teacherDetails.husbandWife_OfficeName : '',Validators.required],
        "isDisabled":['',Validators.required],
        "interDistrictTransferred": ['',Validators.required],
        "dateOFPresenceInterDistrictTransfer": [this.data ? this.data.teacherDetails.dateOFPresenceInterDistrictTransfer : '',Validators.required],
        "interDistrictTransferType": ['',Validators.required],
        "theOriginalDistrictInterDistrictTransfer":[this.data ? this.data.teacherDetails.theOriginalDistrictInterDistrictTransfer : '',Validators.required],
        "dateOfSeniority": [this.data ? this.data.teacherDetails.dateOfSeniority : '',Validators.required],
        "haveYouPassedComputerExam": ['',Validators.required],
        "namesAndTalukasAllSchoolsWorkedEarlier": [this.data ? this.data.teacherDetails.namesAndTalukasAllSchoolsWorkedEarlier : '',Validators.required]
      }),
      "assignTeacher": []
    })

  }

  addStand(stand: any, value: number) {
    console.log("value",value, stand);
    
    this.assignclass=true;
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
      
      
      console.log("array",this.editObj.assignTeacher);

     let findObj= this.assignClassArray.filter((ele: any)=>ele.standardId !== value)
       console.log("delete this",findObj);  
       this.assignClassArray=[...findObj]  
       console.log("fughkgf",this.assignClassArray);
       
      // let index = this.editObj.assignTeacher.indexOf(findIndex);

    //  let  index = this.assignClassArray.findIndex((x: any) => x.standardId === value);
    //   console.log("delete this",index);

      
      // if (index > -1) {
      //   this.editObj.assignTeacher.splice(index, 1);
      // }
      // return this.assignClassArray;
    }
      
  
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
          this.teacherRegForm.controls['districtId'].setValue(1)  
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
          this.editFlag ? (this.teacherRegForm.controls['talukaId'].setValue(this.editObj.talukaId), this.getVillage()) :'';
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getVillage() {
    let talukaId = this.teacherRegForm.value.talukaId
    console.log("fgdfg",talukaId);
    
    this.masterService.getAllVillage('EN', talukaId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.villageArray = res.responseData;                  
          this.editFlag ? (this.teacherRegForm.controls['villageId'].setValue(this.editObj.villageId), this. getCluster()) : this.getCluster();
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }
  getCluster() {
    let talukaId = this.teacherRegForm.value.talukaId
    this.masterService.getAllCenter('EN',talukaId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.clusterArray = res.responseData;    
          console.log("this.clusterArray",this.clusterArray);                
          this.editFlag ? (this.td['clusterId'].setValue(this.editObj.teacherDetails.clusterId), this.getAllSchool()) : this.getAllSchool(); 
         
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
          this.editFlag ? (this.td['schoolId'].setValue(this.editObj.teacherDetails.schoolId), this.getDesignation()) : this.getDesignation();
         
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
          this.editFlag ? (this.td['designationId'].setValue(this.editObj.teacherDetails.designationId), this.getGraduateTeacherSubject()) : this.getGraduateTeacherSubject();
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
          console.log("this.GradateTeacherSubjectArray",this.GradateTeacherSubjectArray);
          this.editFlag ? (this.td['graduate_SubjectId'].setValue(this.editObj.teacherDetails.graduate_SubjectId), this.getGraduatePayScale()) : this.getGraduatePayScale();

         

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

    this.editFlag ? (this.td['isGraduate_PayScale'].setValue(this.editObj.teacherDetails.isGraduate_PayScale), this.getCaste()) : this.getCaste();

  

  }

  getCaste() {
    this.masterService.getAllCaste('EN', 1).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.casteArray = res.responseData;
        
          this.editFlag ? (this.td['castId'].setValue(this.editObj.teacherDetails.castId), this.getCasteCategory()) : this.getCasteCategory();
 
        
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
        
          this.editFlag ? (this.td['castCategoryId'].setValue(this.editObj.teacherDetails.castCategoryId), this.getCasteVerification()) : this.getCasteVerification();
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
  
    this.editFlag ? (this.td['isCastVarificationDone'].setValue(this.editObj.teacherDetails.isCastVarificationDone), this.getEducationQualification()) : this.getEducationQualification();
   
  }

  getEducationQualification() {
    this.masterService.getEducationalQualificationById('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.educationQualificationArray = res.responseData;
       
          this.editFlag ? (this.td['educationalQualificationId'].setValue(this.editObj.teacherDetails.educationalQualificationId), this.getTwelveBranch()) : this.getTwelveBranch();

         
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
      
          this.editFlag ? (this.td['branchId12th'].setValue(this.editObj.teacherDetails.branchId12th), this.getOptionalSubject()) : this.getOptionalSubject();

         
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
     
          this.editFlag ? (this.td['degreeOptionalSubjectsId'].setValue(this.editObj.teacherDetails.degreeOptionalSubjectsId), this.getDegreeUniversity()) : this.getDegreeUniversity();

         
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
          

          this.editFlag ? (this.td['degreeUniversityId'].setValue(this.editObj.teacherDetails.degreeUniversityId), this.getProfesionalQualification()) : this.getProfesionalQualification();

        
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
         
          this.editFlag ? (this.td['professionalQualificationId'].setValue(this.editObj.teacherDetails.professionalQualificationId), this.gethusbandWifeBothService()) : this.gethusbandWifeBothService();

         
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

   

    this.editFlag ? (this.td['husbandWife_Both_Service'].setValue(this.editObj.teacherDetails.husbandWife_Both_Service), this.getAreyouDisabled()) : this.getAreyouDisabled();


    
  }
  getAreyouDisabled() {
    this.AreyouDisabled = [
      { id: 1, name: 'yes', isDisabled: true },
      { id: 2, name: 'no', isDisabled: false }
    ];  

    this.editFlag ? (this.td['isDisabled'].setValue(this.editObj.teacherDetails.isDisabled), this.getInterDistrictTransferred()) : this.getInterDistrictTransferred();

   
  }

  getInterDistrictTransferred() {
    this.interDistrictTransferredArray = [
      { id: 1, name: 'yes', interDistrictTransferred: true },
      { id: 2, name: 'no', interDistrictTransferred: false }
    ];
    this.editFlag ? (this.td['interDistrictTransferred'].setValue(this.editObj.teacherDetails.interDistrictTransferred), this.GetInterDistrictTransferType()) : this.GetInterDistrictTransferType();
    
  }

  GetInterDistrictTransferType() {
    this.masterService.getAllInterDistrictTransferType('EN',).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.interDistrictTransferTypeArray = res.responseData;
          // console.log("interDistrictTransferTypeArray", this.interDistrictTransferTypeArray); 
          // if (this.editFlag) {
          //   this.teacherRegForm.patchValue({
          //     teacherDetails: {
          //       interDistrictTransferType: this.editObj.teacherDetails?.interDistrictTransferType
          //     }
          //   }),this.getHaveYouPassedComputerExam();
          // }  else{
          //   this.getHaveYouPassedComputerExam();
          // }   

          this.editFlag ? (this.td['interDistrictTransferType'].setValue(this.editObj.teacherDetails.interDistrictTransferType), this.getHaveYouPassedComputerExam()) : this.getHaveYouPassedComputerExam();

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
    this.editFlag ? this.td['haveYouPassedComputerExam'].setValue(this.editObj.teacherDetails.haveYouPassedComputerExam) : '';

    // if (this.editFlag) {
    //   this.teacherRegForm.patchValue({
    //     teacherDetails: {
    //       haveYouPassedComputerExam: this.editObj.teacherDetails?.haveYouPassedComputerExam
    //     }
    //   })
    // }     
  }

  imgUpload(event: any) {
    this.img = true;
    this.fileUpload.uploadDocuments(event, 'Upload', 'jpg, jpeg, png').subscribe((res: any) => {
      this.uploadImg = res.responseData;
      this.showAddRemImg = true;
    });
  }

  OnSubmit() {
    // console.log(this.teacherRegForm.value);
    let formValue = this.teacherRegForm.value;
    formValue.uploadImage ? formValue.uploadImage = this.uploadImg : '';
    !this.showAddRemImg ? formValue.uploadImage = '' : formValue.uploadImage = formValue.uploadImage;

    if(this.editFlag == true){
      if(this.data.uploadImage){
        this.img ? formValue.uploadImage = this.uploadImg  : formValue.uploadImage = this.data.uploadImage 
      } 
      else{
        formValue.uploadImage = this.teacherRegForm.value.uploadImage;
      }
    }

    if(!this.teacherRegForm.valid){
      return
    }
    else{
      formValue.assignTeacher = this.assignClassArray;
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
  }

  onEdit(obj: any) {
    this.editFlag = true;
    this.editObj = obj;
    console.log("editObj", this.editObj);
    this.data.uploadImage ? this.teacherRegForm.value.uploadImage = obj.uploadImage : '';
    this.data.uploadImage ? this.showAddRemImg = true : this.showAddRemImg = false;
    this.assignClassArray = obj.assignTeacher;

     for(let i=0; i<this.newAsssignClassArray.length;i++){
      for(let j=0 ;j<obj.assignTeacher.length;j++){  
         if(this.newAsssignClassArray[i].standardId == obj.assignTeacher[j].standardId){
          this.newAsssignClassArray[i].checked = true;
         }
      }
   }
    this.formData(); this.getGender();
  }

  clearImg() {  
    this.teacherRegForm.value.uploadImage = '';
    this.f['uploadImage'].setValue('');
    this.showAddRemImg = false;
  }

  viewImg(){
    if (this.editFlag == true) {
      let viewImg = this.data.uploadImage;
      this.uploadImg ? window.open(this.uploadImg, 'blank') : window.open(viewImg, 'blank')
    }
    else {
      window.open(this.uploadImg, 'blank');
    }
    // window.open(this.uploadImg, 'blank');
  }

  clearDropdown(dropdown: string) {
    this.editFlag = false;
    if (dropdown == 'Taluka') {
      this.f['villageId'].setValue('');
      this.  villageArray = [];
    }    
  }

}
