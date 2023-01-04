import { Component,ElementRef,Inject, ViewChild} from '@angular/core';
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
  selector: 'app-add-update-teacher-registration',
  templateUrl: './add-update-teacher-registration.component.html',
  styleUrls: ['./add-update-teacher-registration.component.scss']
})
export class AddUpdateTeacherRegistrationComponent {
  teacherRegForm!: FormGroup;
  editFlag: boolean = false;
  assignclass: boolean = false;
  editObj: any;
  uploadImghtml:string='';
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
  interDistrictTransferTypeArray = new Array();
  assignClassArray = new Array();
  districtArrayTeacherDeatails = new Array();
  talukaArrayTeacherDetails = new Array();
  img: boolean = false;
  checked:boolean=false
  maxDate = new Date();
  assignClass: boolean = true;
  casteVerification = [
    { id: 1, name: 'yes', isCastVarificationDone: true,_name :'होय' },
    { id: 2, name: 'no', isCastVarificationDone: false ,_name :'नाही'}
  ];
  husbandWifeBothServiceArray = [
    { id: 1, name: 'yes', husbandWife_Both_Service: true ,_name :'होय'},
    { id: 2, name: 'no', husbandWife_Both_Service: false ,_name :'नाही'}
  ];
  AreyouDisabled = [
    { id: 1, name: 'yes', isDisabled: true ,_name :'होय'},
    { id: 2, name: 'no', isDisabled: false,_name :'नाही' }
  ];
  interDistrictTransferredArray = [
    { id: 1, name: 'yes', interDistrictTransferred: true ,_name :'होय'},
    { id: 2, name: 'no', interDistrictTransferred: false ,_name :'नाही'}
  ];
  haveYouPassedComputerExamArray =[
    { id: 1, name: 'yes', haveYouPassedComputerExam: true,_name :'होय' },
    { id: 2, name: 'no', haveYouPassedComputerExam: false,_name :'नाही' }
  ];
  isGraduatePayScaleArray = [
    { id: 1, name: 'yes', isGraduate_PayScale: true ,_name :'होय'},
    { id: 2, name: 'no', isGraduate_PayScale: false ,_name :'नाही'}
  ];


  newAsssignClassArray = [
    { standardId: 1, checked: false },
    { standardId: 2, checked: false },
    { standardId: 3, checked: false },
    { standardId: 4, checked: false },
    { standardId: 5, checked: false },
    { standardId: 6, checked: false },
    { standardId: 7, checked: false },
    { standardId: 8, checked: false }
  ];

  @ViewChild('uploadImage') imageFile!: ElementRef;
  
  constructor(private masterService: MasterService, private commonMethod: CommonMethodsService, private errorHandler: ErrorsService,
    private fileUpload: FileUploadService, public validation: ValidationService,public webStorageS: WebStorageService,private ngxSpinner : NgxSpinnerService,
    private fb: FormBuilder, private service: ApiService, public dialogRef: MatDialogRef<AddUpdateTeacherRegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.formData();
    (!this.data) ? this.getGender() : this.onEdit(this.data);

  }
  //#region --------------------------get form Controls ---------------------------------
  get f() {
    return this.teacherRegForm.controls;
  }
  get td() {
    return ((this.teacherRegForm.get('teacherDetails') as FormGroup).controls)
  }
//#endregion-------------------------- end form controls ---------------------------------
//#region ---------------------------- start form object ---------------------------------
  formData() {
    this.teacherRegForm = this.fb.group({
      ...this.webStorageS.createdByProps(),
      "id": [this.data ? this.data?.id : 0],
      "name": [this.data ? this.data?.name : '', [Validators.required,Validators.pattern(this.validation.fullName)]],
      "m_Name": [this.data ? this.data?.m_Name : '', [Validators.required,Validators.pattern('^[\u0900-\u0965 ]+$')]],
      "address": [''],
      "stateId": 0,
      "districtId": ['', Validators.required],
      "talukaId": ['', Validators.required],
      "villageId": ['', Validators.required],
      "centerId": 0,
      "userTypeId": 0,
      "subUserTypeId": 0,
      "genderId": ['', Validators.required],
      "mobileNo": [this.data ? this.data?.mobileNo : '', [Validators.required, Validators.pattern(this.validation.mobile_No)]],
      "emailId": [this.data ? this.data?.emailId : '', Validators.pattern(this.validation.email)],
      "birthDate": [this.data ? this.data?.birthDate : '', Validators.required],
      "age": [this.data ? this.data?.age : 0],
      "uploadImage": [''],
      "currentAddress": [this.data ? this.data?.currentAddress : '', Validators.required],
      "permentAddress": [this.data ? this.data?.permentAddress : '', Validators.required],
      "lan": this.webStorageS.languageFlag,
      "localID": 0,
      "timestamp": new Date(),
      teacherDetails: this.fb.group({
        ...this.webStorageS.createdByProps(),
        "id": 0,
        "teacherId": 0,
        "districtId":['', Validators.required],
        "talukaId":['', Validators.required],
        "villageId": 0,
        "schoolId": ['', Validators.required],
        "clusterId": ['', Validators.required],
        "designationId": ['', Validators.required],
        "graduate_SubjectId": ['', Validators.required],
        "isGraduate_PayScale": [this.data ? this.data.teacherDetails?.isGraduate_PayScale:'', Validators.required],
        "castId": ['', Validators.required],
        "castCategoryId": [null],
        "castCertificateNo": [this.data ? this.data.teacherDetails?.castCertificateNo : ''],
        "castCertificateOffice": [this.data ? this.data.teacherDetails?.castCertificateOffice : '',Validators.pattern('^[ a-zA-Z0-9]+$')],
        "isCastVarificationDone": [this.data ? this.data.teacherDetails?.isCastVarificationDone : null],
        "castValidityNoDate": [this.data ? this.data.teacherDetails?.castValidityNoDate : ''],
        "castverificationCommitteeName": [this.data ? this.data.teacherDetails?.castverificationCommitteeName : '',Validators.pattern(this.validation.fullName)],
        "dateOfFirstAppoinmentService": [this.data ? this.data.teacherDetails?.dateOfFirstAppoinmentService : '', Validators.required],
        "currentSchoolJoiningDate": [this.data ? this.data.teacherDetails?.currentSchoolJoiningDate : '', Validators.required],
        "currentTalukaPresentDate": [this.data ? this.data.teacherDetails?.currentTalukaPresentDate : '', Validators.required],
        "retirementDate": [this.data ? this.data.teacherDetails?.retirementDate : '', Validators.required],
        "educationalQualificationId": ['', Validators.required],
        "branchId12th": ['', Validators.required],
        "degreeOptionalSubjectsId": ['', Validators.required],
        "degreeUniversityId": ['', Validators.required],
        "professionalQualificationId": ['', Validators.required],
        "bEdPercentages": [this.data ? this.data.teacherDetails?.bEdPercentages : '',Validators.pattern('[0-9]{1,2}((\.)[0-9]{2})?%?')],
        "bEdUniversityId": [this.data ? this.data.teacherDetails?.bEdUniversityId : '',Validators.pattern(this.validation.fullName)],
        "husbandWife_Both_Service": [this.data ? this.data.teacherDetails?.husbandWife_Both_Service : '', Validators.required],
        "husbandWife_OfficeName": [this.data ? this.data.teacherDetails?.husbandWife_OfficeName : ''],
        "isDisabled": [this.data ? this.data.teacherDetails?.isDisabled :'', Validators.required],
        "interDistrictTransferred": [this.data ? this.data.teacherDetails?.interDistrictTransferred :'', Validators.required],
        "dateOFPresenceInterDistrictTransfer": [this.data ? this.data.teacherDetails?.dateOFPresenceInterDistrictTransfer : null],
        "interDistrictTransferType": [null],
        "theOriginalDistrictInterDistrictTransfer": [this.data ? this.data.teacherDetails?.theOriginalDistrictInterDistrictTransfer : ''],
        "dateOfSeniority": [this.data ? this.data.teacherDetails?.dateOfSeniority : '', Validators.required],
        "haveYouPassedComputerExam": [this.data ? this.data.teacherDetails?.haveYouPassedComputerExam :'', Validators.required],
        "namesAndTalukasAllSchoolsWorkedEarlier": [this.data ? this.data.teacherDetails?.namesAndTalukasAllSchoolsWorkedEarlier : '', Validators.required]
      }),
      "assignTeacher": []
    })
  }
//#endregion --------------------------- end form object ----------------------------------
//#region ------------------ start update validation hide show field -----------------------
  castvalidation(obj: any) {
    if (obj.value != 1) {  
      this.td['castCertificateNo'].setValue('');
      this.td['castCertificateOffice'].setValue('');
      this.td['isCastVarificationDone'].setValue(null);
      this.td['castValidityNoDate'].setValue('');
      this.td['castverificationCommitteeName'].setValue(''); 

      // this.td["castCategoryId"].setValidators(Validators.required);
      this.td["castCertificateNo"].setValidators(Validators.required);
      this.td["castCertificateOffice"].setValidators(Validators.required);
      this.td["isCastVarificationDone"].setValidators(Validators.required);
      this.td["castValidityNoDate"].setValidators(Validators.required);
      this.td["castverificationCommitteeName"].setValidators(Validators.required);   
    }else{ // this.td['castCategoryId'].clearValidators();
      this.td['castCertificateNo'].clearValidators();
      this.td['castCertificateOffice'].clearValidators();
      this.td['isCastVarificationDone'].clearValidators();
      this.td['castValidityNoDate'].clearValidators();
      this.td['castverificationCommitteeName'].clearValidators();
      // this.td['castCategoryId'].setValue(null);   
    }
    // this.td['castCategoryId'].updateValueAndValidity();
    this.td['castCertificateNo'].updateValueAndValidity();
    this.td['castCertificateOffice'].updateValueAndValidity();
    this.td['isCastVarificationDone'].updateValueAndValidity();
    this.td['castValidityNoDate'].updateValueAndValidity();
    this.td['castverificationCommitteeName'].updateValueAndValidity();
    
  }

  removeValidators(obj: any) {
    if (obj.value == true) {
      this.td["husbandWife_OfficeName"].setValidators(Validators.required);     
    }else{
      this.td['husbandWife_OfficeName'].clearValidators();
      this.td['husbandWife_OfficeName'].setValue('');
    }
    this.td['husbandWife_OfficeName'].updateValueAndValidity();
  }

  interDistrictTrafValidators(obj:any){   
    console.log("validation",obj.value);
    
    if (obj.value == true) {
      this.td['dateOFPresenceInterDistrictTransfer'].setValue(null);
      this.td['interDistrictTransferType'].setValue(null);
      this.td['theOriginalDistrictInterDistrictTransfer'].setValue('');
      
      this.td["dateOFPresenceInterDistrictTransfer"].setValidators(Validators.required); 
      this.td["interDistrictTransferType"].setValidators(Validators.required); 
      this.td["theOriginalDistrictInterDistrictTransfer"].setValidators(Validators.required);      
    }else{
      this.td['dateOFPresenceInterDistrictTransfer'].clearValidators();
      this.td['interDistrictTransferType'].clearValidators();
      this.td['theOriginalDistrictInterDistrictTransfer'].clearValidators();      
    }
    this.td['dateOFPresenceInterDistrictTransfer'].updateValueAndValidity();
    this.td['interDistrictTransferType'].updateValueAndValidity();
    this.td['theOriginalDistrictInterDistrictTransfer'].updateValueAndValidity();
  }
  
//#endregion ---------------- end update validation hide show field -------------------------

//#region -------------------------start standard check box ----------------------------------
  addStand(stand: any, value: number) {
    this.assignclass = true;
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
      let findObj = this.assignClassArray.filter((ele: any) => ele.standardId !== value)
      this.assignClassArray = [...findObj]
    }
  }
//#endregion-------------------------end standard check box ------------------------------------

//#region --------------------------start permant address check box ----------------------------------
  addSameAddress(event:any){
   this.checked=event.currentTarget.checked;
    if(this.checked == true){
      let sameAddress = this.teacherRegForm.value.currentAddress
      this.f['permentAddress'].setValue(sameAddress);
    }else{
      this.f['permentAddress'].setValue('');
    }   
  }
//#endregion --------------------------end permant address check box ----------------------------------

//#region ------------------------------ start drop-down ---------------------------------------------
  getGender() {
    this.masterService.getAllGender('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200 && res.responseData.length) {
          this.genderArray = res.responseData;       
          this.editFlag == true ? (this.teacherRegForm.controls['genderId'].setValue(this.editObj?.genderID), this.getDistrict()) : (this.editFlag== false) ? (this.getDistrict(),this.getAllDistrictTeacherDetails()) : ''
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
  }

  getDistrict() {
    console.log("district editFlag",this.editFlag);
    
    this.masterService.getAllDistrict('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200 && res.responseData.length) {
          this.districtArray = res.responseData;               
          this.teacherRegForm.controls['districtId'].setValue(1)
          this.editFlag ? (this.teacherRegForm.controls['districtId'].setValue(this.editObj?.districtId), this.getTaluka()) : this.getTaluka();
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
  }
  
  getTaluka() {
    this.masterService.getAllTaluka('EN').subscribe({
      next: ((res: any) => { 
        if (res.statusCode == 200 && res.responseData.length) {
          this.talukaArray = res.responseData;          
          this.editFlag ? (this.teacherRegForm.controls['talukaId'].setValue(this.editObj?.talukaId), this.getVillage()) : '';
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    });
  }

  getVillage() {
    let talukaId = this.teacherRegForm.value.talukaId
    this.masterService.getAllVillage('EN', talukaId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200 && res.responseData.length) {
          this.villageArray = res.responseData;            
          this.editFlag ? (this.teacherRegForm.controls['villageId'].setValue(this.editObj?.villageId), this.getAllDistrictTeacherDetails()) : '';
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
  }

  getAllDistrictTeacherDetails() {
    this.masterService.getAllDistrict('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200 && res.responseData.length) {
          this.districtArrayTeacherDeatails = res.responseData;
          this.td['districtId'].setValue(1)
          this.editFlag ? (this.td['districtId'].setValue(this.editObj.teacherDetails?.districtId), this.getAllTalukaTeacherDeatails()) :!this.editFlag ? (this.getAllTalukaTeacherDeatails(),this.getDesignation()):'';

        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
  }

  getAllTalukaTeacherDeatails() {
    this.masterService.getAllTaluka('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200 && res.responseData.length) {
          this.talukaArrayTeacherDetails = res.responseData;
          this.editFlag ? (this.td['talukaId'].setValue(this.editObj.teacherDetails?.talukaId), this.getCluster()) : '';
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
  }

  getCluster() {
    let talukaId = this.teacherRegForm.value.teacherDetails.talukaId;
    this.masterService.getAllCenter('EN', talukaId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200 && res.responseData.length) {
          this.clusterArray = res.responseData;      
          this.editFlag ? (this.td['clusterId'].setValue(this.editObj.teacherDetails?.clusterId), this.getAllSchool()) : '';
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
  }
  getAllSchool() {
    let talukaId = this.teacherRegForm.value.teacherDetails.talukaId;
    let clusterId = this.teacherRegForm.value.teacherDetails.clusterId;
    this.masterService.getAllSchoolByCriteria('EN', talukaId, 0, clusterId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200 && res.responseData.length) {
          this.schoolArray = res.responseData;        
          this.editFlag ? (this.td['schoolId'].setValue(this.editObj.teacherDetails?.schoolId), this.getDesignation()) : '';
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
  }
  getDesignation() {
    this.masterService.GetDesignationByLevelId('EN', 3).subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200 && res.responseData.length) {
          this.designationArray = res.responseData;    
          this.editFlag ? (this.td['designationId'].setValue(this.editObj.teacherDetails?.designationId), this.getGraduateTeacherSubject()) : this.getGraduateTeacherSubject();
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
  }
  getGraduateTeacherSubject() {
    this.masterService.getAllSubject('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200 && res.responseData.length) {
          this.GradateTeacherSubjectArray = res.responseData;
          this.editFlag ? (this.td['graduate_SubjectId'].setValue(this.editObj.teacherDetails?.graduate_SubjectId), this.getCaste()) : this.getCaste();
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
  }
  getCaste() {
    this.masterService.getAllCaste('EN', 1).subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200 && res.responseData.length) {
          this.casteArray = res.responseData;  
          this.editFlag ? (this.td['castId'].setValue(this.editObj.teacherDetails?.castId), this.getCasteCategory()) : this.getCasteCategory();
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
  }
  getCasteCategory() {
    this.masterService.getCastCategoryDescById('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200 && res.responseData.length) {
          this.castCategoryArray = res.responseData;         
          this.editFlag ? (this.td['castCategoryId'].setValue(this.editObj.teacherDetails?.castCategoryId), this.getEducationQualification()) : this.getEducationQualification();
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
  }

  getEducationQualification() {
    this.masterService.getEducationalQualificationById('EN').subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200 && res.responseData.length) {
          this.educationQualificationArray = res.responseData;
          this.editFlag ? (this.td['educationalQualificationId'].setValue(this.editObj.teacherDetails?.educationalQualificationId), this.getTwelveBranch()) : this.getTwelveBranch();
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
   }
  getTwelveBranch() {
    this.masterService.getTwelveBranchCategoryDescById('EN',).subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200 && res.responseData.length) {
          this.twelveBranchArray = res.responseData;
          this.editFlag ? (this.td['branchId12th'].setValue(this.editObj.teacherDetails?.branchId12th), this.getOptionalSubject()) : this.getOptionalSubject();
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
  }
  getOptionalSubject() {
    this.masterService.getOptionalSubjectCategoryDescById('EN',).subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200 && res.responseData.length) {
          this.optionalSubjectArray = res.responseData;         
          this.editFlag ? (this.td['degreeOptionalSubjectsId'].setValue(this.editObj.teacherDetails?.degreeOptionalSubjectsId), this.getDegreeUniversity()) : this.getDegreeUniversity();
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
  }

  getDegreeUniversity() {
    this.masterService.getUniversityCategoryDescById('EN',).subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200 && res.responseData.length) {
          this.degreeUniversityArray = res.responseData;
          
          this.editFlag ? (this.td['degreeUniversityId'].setValue(this.editObj.teacherDetails?.degreeUniversityId), this.getProfesionalQualification()) : this.getProfesionalQualification();
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
  }

  getProfesionalQualification() {
    this.masterService.getProfessinalQualificationById('EN',).subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200 && res.responseData.length) {
          this.profesionalQualificationArray = res.responseData;        
          this.editFlag ? (this.td['professionalQualificationId'].setValue(this.editObj.teacherDetails?.professionalQualificationId), this.GetInterDistrictTransferType()) : this.GetInterDistrictTransferType();
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
  }

  GetInterDistrictTransferType() {
    this.masterService.getAllInterDistrictTransferType('EN',).subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200 && res.responseData.length) {
          this.interDistrictTransferTypeArray = res.responseData;
          this.editFlag ? this.td['interDistrictTransferType'].setValue(this.editObj.teacherDetails?.interDistrictTransferType) : '';

        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
  }

  //#endregion ----------------------------------end drop-down ------------------------------------------
  imgUpload(event: any) {
    this.img = true;
    this.fileUpload.uploadDocuments(event, 'Upload', 'jpg, jpeg, png').subscribe((res: any) => {
     if(res.statusCode == 200){
      this.uploadImghtml = res.responseData;    
      // this.showAddRemImg = true;
     }else{
      return;
     }
    });
  }

  //#region  -------------------------------------start submit --------------------------------------------
  OnSubmit() {
    let formValue = this.teacherRegForm.value;    
    if (this.editFlag == true) {
        this.img ? formValue.uploadImage = this.uploadImghtml : formValue.uploadImage = this.data.uploadImage   
    }else{
      formValue.uploadImage = this.uploadImghtml;
      // formValue.uploadImage ? formValue.uploadImage = this.uploadImghtml : ''; 
    }
    if (this.teacherRegForm.invalid) {  
      this.assignClass =false;   
        this.commonMethod.showPopup(this.webStorageS.languageFlag == 'EN' ? 'Please Enter Mandatory Fields' : 'कृपया अनिवार्य फील्ड प्रविष्ट करा', 1);
        return      
    }
    else {
      if(this.assignClassArray.length){
        this.assignClass =true;
        formValue.assignTeacher = this.assignClassArray;
        let postObj = this.teacherRegForm.value;
        this.ngxSpinner.show();
        let url = this.editFlag ? 'Update' : 'Add'
        this.service.setHttp(this.editFlag ? 'put' : 'post','zp_osmanabad/Teacher/'+ url, false, postObj, false, 'baseUrl');
        this.service.getHttp().subscribe({
          next: ((res: any) => {
            this.ngxSpinner.hide();
            res.statusCode == 200 ? (this.commonMethod.showPopup(res.statusMessage, 0)) : this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.showPopup(res.statusMessage, 1);       
              this.dialogRef.close('yes');           
          }),
          error: (error: any) => {
            this.ngxSpinner.hide();
            this.commonMethod.checkEmptyData(error.statusMessage) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusMessage, 1);
          }
        })
      }else{  
        this.commonMethod.showPopup(this.webStorageS.languageFlag == 'EN' ? 'Please Enter Mandatory Fields' : 'कृपया अनिवार्य फील्ड प्रविष्ट करा', 1);       
        this.assignClass =false;
      }
     
         
     
      
  
    }
  }
//#endregion -------------------------------------end submit-----------------------------------------------
//#region ---------------------------------------- start edit ----------------------------------------------
  onEdit(obj: any) {
    console.log("editObj",obj);
    this.editFlag = true;
    this.assignClass =true;
    this.editObj = obj; 
     
    // this.data.uploadImage ? this.teacherRegForm.value.uploadImage = obj.uploadImage : '';
    // this.data.uploadImage ? this.showAddRemImg = true : this.showAddRemImg = false;
    this.assignClassArray = obj.assignTeacher;    
    this.uploadImghtml =  this.editObj.uploadImage;

    //---------------------------start patch assign class check-box---------------------------//
    for (let i = 0; i < this.newAsssignClassArray.length; i++) {
      for (let j = 0; j < obj.assignTeacher.length; j++) {
        if (this.newAsssignClassArray[i].standardId == obj.assignTeacher[j].standardId) {
          this.newAsssignClassArray[i].checked = true;
        }
      }
    }
    //---------------------------end patch assign class check-box---------------------------//
    //---------------------------star patch current and perment address check-box---------------------------//
    if(obj.currentAddress == obj.permentAddress){
      this.checked = true;
    }
     //---------------------------end patch current and perment address check-box---------------------------//
    this.formData(); this.getGender();
  }
//#endregion --------------------------------------- end edit ----------------------------------------------
  clearImg() {   
    this.imageFile.nativeElement.value = '';
    this.f['uploadImage'].setValue('');
    this.data.uploadImage = '';
    this.uploadImghtml = '';
    this.showAddRemImg = false;
  }

  viewImg() {
    if (this.editFlag == true) {
      let viewImg = this.data.uploadImage;
      this.uploadImghtml ? window.open(this.uploadImghtml, 'blank') : window.open(viewImg, 'blank')
    }
    else {
      window.open(this.uploadImghtml, 'blank');
    }
  }

  clearDropdown(dropdown: string) {
    // this.editFlag = true;
    if (dropdown == 'Taluka') {
      this.f['villageId'].setValue('');
      this.villageArray = [];
    }else if(dropdown == 'talukaTeacherDetails'){
      this.td['clusterId'].setValue('');
      this.td['schoolId'].setValue('');
      this.clusterArray =[];
      this.schoolArray = [];
    }
  }
 
}
