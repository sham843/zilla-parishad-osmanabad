import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-add-update-office-users',
  templateUrl: './add-update-office-users.component.html',
  styleUrls: ['./add-update-office-users.component.scss']
})
export class AddUpdateOfficeUsersComponent implements OnInit {
  levels = new Array();
  designations = new Array();
  officeForm!: FormGroup;
  districts = new Array();
  talukas = new Array();
  centers = new Array();
  schools = new Array();

  constructor(private masterService: MasterService,
              private fb: FormBuilder,
              private apiService: ApiService,
              private commonService: CommonMethodsService,
              private error: ErrorsService,
              private dialogRef: MatDialogRef<AddUpdateOfficeUsersComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, 
              public validation : ValidationService,
              public webStorageService : WebStorageService){}
              
  ngOnInit(){
    this.defaultForm();
    console.log("dataaa",this.data);
    
    (!this.data) ? (this.getLevelDrop(), this.getTalukaDrop(), this.getDistrictDrop()): '';
  }

  defaultForm(){
    this.officeForm = this.fb.group(
      {
        // "createdBy": [0],
        // "modifiedBy": [0],
        // "createdDate": [new Date()],
        // "modifiedDate": [new Date()],
        // "isDeleted": [true],
        ...this.webStorageService.createdByProps(),
        "id": [this.data ? this.data.id : 0],
        "name": [this.data ? this.data.name :"",[Validators.required, Validators.pattern(this.validation.fullName)]],
        "m_Name": [this.data ? this.data.m_Name:""],
        "mobileNo": [this.data ? this.data.mobileNo : "",[Validators.required, Validators.pattern(this.validation.mobile_No)]],
        "emailId": [this.data ? this.data.emailId :"", [Validators.required, Validators.pattern(this.validation.email)]],
        "address": [this.data ? this.data.address:"",[Validators.required,Validators.maxLength(500)]],
        "schoolId": [this.data ? this.data.schoolId:0, Validators.required],
        "designationId": [this.data ? this.data.designationId : 0,  Validators.required],
        "designationLevelId": [this.data ? this.data.designationLevelId : "",  Validators.required],
        "stateId": [this.data ? this.data.stateId: 0],
        "districtId": [this.data ? this.data.districtId: 0,  Validators.required],
        "talukaId": [this.data ? this.data.talukaId:0 ,  Validators.required],
        "userTypeId": [this.data ? this.data.userTypeId:0],
        "subUserTypeId": [this.data ? this.data.subUserTypeId:0],
        "kendraMobileNo": [this.data ? this.data.kendraMobileNo:"", [Validators.required, Validators.pattern(this.validation.mobile_No)]],
        "kendraEmailId": [this.data ? this.data.kendraEmailId:"", [Validators.required, Validators.pattern(this.validation.email)]],
        "beoEmailId": [this.data ? this.data.beoEmailId:"" , [Validators.required, Validators.pattern(this.validation.email)]],
        "beoMobileNo": [this.data ? this.data.beoMobileNo:"",[Validators.required, Validators.pattern(this.validation.mobile_No)]],  
        "centerId": [this.data ? this.data.centerId:0, Validators.required],
        "bitName": [this.data ? this.data.bitName:"",[Validators.required, Validators.pattern(this.validation.fullName)]],
        "lan": [this.webStorageService.languageFlag]
    })
    this.data? (this.getLevelDrop(), this.getDistrictDrop(), this.getTalukaDrop(), this.getDesignationByLevelId()): ''
    // this.getDistrictDrop();
    // this.getTalukaDrop();
    // this.getDesignationByLevelId();
  }

  get fc() { return this.officeForm.controls}

  getLevelDrop(){
    this.masterService.GetAllDesignationLevel(this.webStorageService.languageFlag).subscribe({
      next: (resp: any)=>{
        console.log("level",resp);
        resp.statusCode == "200" ? this.levels = resp.responseData : this.levels = [];
      },
      error: ( error : any)=>{
        console.log("error is :", error);  
      }
    }) 
  }

  onchangeLevel(event: any){
    console.log(event.value);
    this.designations = [];
    this.getDesignationByLevelId();
  }

  getDesignationByLevelId(){
    let levelId = this.officeForm.value.designationLevelId;
    console.log(levelId);
    this.masterService.GetDesignationByLevelId(this.webStorageService.languageFlag, levelId).subscribe({
      next: (resp: any)=>{
        console.log("designation : ",resp);
        resp.statusCode == "200" ? this.designations = resp.responseData : this.designations = [];
      },
      error: ( error : any)=>{
        console.log("error is getDesignationByLevelId:", error);  
      }
    }) 
  }

  getAllSchoolsByCenterId(){
    let centerId = this.officeForm.value.designationLevelId;
    this.masterService.getAllSchoolsByCenterId(this.webStorageService.languageFlag, centerId).subscribe({
      next: (resp: any)=>{
        resp.statusCode == "200" ?(console.log(resp), this.schools = resp.responseData ): this.schools = [];
      },
      error: ( error : any)=>{
        console.log("error is :", error);  
      }
    });
  }

  getDistrictDrop(){
    this.masterService.getAllDistrict(this.webStorageService.languageFlag).subscribe({
      next: (resp: any)=>{
        resp.statusCode == "200" ? this.districts = resp.responseData : this.districts = [];
      },
      error: ( error : any)=>{
        console.log("error is :", error);  
      }
    });
  }

  getTalukaDrop(){
    this.masterService.getAllTaluka(this.webStorageService.languageFlag).subscribe({
      next: (resp: any)=>{
        resp.statusCode == "200" ? (console.log(resp), this.talukas = resp.responseData) : this.talukas = [];
      },
      error: ( error : any)=>{
        console.log("error is :", error);  
      }
    });
  }

  getCenterDrop(){
    console.log(this.officeForm.value.designationId);
    this.masterService.getAllCenter(this.webStorageService.languageFlag).subscribe({
      next: (resp: any)=>{
        resp.statusCode == "200" ? (console.log("resp cluster", resp),
        this.centers = resp.responseData) : this.centers = [];
      },
      error: ( error : any)=>{
        console.log("error is :", error);  
      }
    })
  }

  submitOfficeData(){
    console.log("all data submitted:", this.officeForm.value);
    this.apiService.setHttp(this.data ? 'PUT': 'POST', this.data ? 'zp_osmanabad/Office/UpdateOffice': 'zp_osmanabad/Office/AddOffice', false, this.officeForm.value, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
       res.statusCode === "200" ? (console.log(res),this.commonService.snackBar(res.statusMessage, 0)):this.commonService.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        this.dialogRef.close('Yes');
      },
      error: ((error: any) => {
        this.error.handelError(error.status);
        this.commonService.checkEmptyData(error.status) == false ? this.error.handelError(error.status) : this.commonService.snackBar(error.status, 1);
      })
    });
  }




}
