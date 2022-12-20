import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';

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
  constructor(private masterService: MasterService,
              private fb: FormBuilder,
              private apiService: ApiService,
              private commonService: CommonMethodsService,
              private error: ErrorsService,
              private dialogRef: MatDialogRef<AddUpdateOfficeUsersComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any){}
              
  ngOnInit(){
    this.defaultForm();
    !this.data ? this.getLevelDrop(): '';
    !this.data ? this.getDistrictDrop(): '';
    console.log("dataa",this.data);
  }

  defaultForm(){
    this.officeForm = this.fb.group(
      {
        "createdBy": [0],
        "modifiedBy": [0],
        "createdDate": [new Date()],
        "modifiedDate": [new Date()],
        "isDeleted": [true],
        "id": [this.data ? this.data.id : 0],
        "name": [this.data ? this.data.name :""],
        "m_Name": [""],
        "mobileNo": [this.data ? this.data.mobileNo : ""],
        "emailId": [this.data ? this.data.emailId :""],
        "address": [""],
        "designationId": [this.data ? this.data.designationId : 0],
        "designationLevelId": [this.data ? this.data.designationLevelId : ""],
        "stateId": [0],
        "districtId": [this.data ? this.data.districtId: 0],
        "talukaId": [0],
        "userTypeId": [0],
        "subUserTypeId": [0],
        "kendraMobileNo": [""],
        "kendraEmailId": [""],
        "centerId": [0],
        "lan": ["mr-IN"]
    })
    this.getLevelDrop();
    this.getDistrictDrop();
  }

  getLevelDrop(){
    this.masterService.GetAllDesignationLevel('mr-IN').subscribe({
      next: (resp: any)=>{
        this.levels = resp.responseData;
      },
      error: ( error : any)=>{
        console.log("error is :", error);  
      }
    }) 
  }

  getDesignationByLevelId(){
    let levelId = this.officeForm.value.designationLevelId;
    this.masterService.GetDesignationByLevelId('mr-IN', levelId).subscribe({
      next: (resp: any)=>{
        this.designations = resp.responseData;
      },
      error: ( error : any)=>{
        console.log("error is :", error);  
      }
    }) 
  }

  getDistrictDrop(){
    this.masterService.getAllDistrict('mr-IN').subscribe({
      next: (resp: any)=>{
        this.districts = resp.responseData;
      },
      error: ( error : any)=>{
        console.log("error is :", error);  
      }
    });
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
