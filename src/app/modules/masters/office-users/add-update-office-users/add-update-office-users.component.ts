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
        "id": [0],
        "name": [""],
        "m_Name": [""],
        "mobileNo": [""],
        "emailId": [""],
        "address": [""],
        "designationId": [0],
        "designationLevelId": [""],
        "stateId": [0],
        "districtId": [0],
        "talukaId": [0],
        "userTypeId": [0],
        "subUserTypeId": [0],
        "kendraMobileNo": [""],
        "kendraEmailId": [""],
        "centerId": [0],
        "lan": ["mr-IN"]
    })
  }

  getLevelDrop(){
    this.masterService.GetAllDesignationLevel('mr-IN').subscribe({
      next: (resp: any)=>{
        console.log(" all getLevelDrop:", resp);    
        this.levels = resp.responseData;
      },
      error: ( error : any)=>{
        console.log("error is :", error);  
      }
    }) 
  }

  getDesignationByLevelId(){
    let levelId = this.officeForm.value.designationLevelId;
    console.log("jedhsjj",levelId);

    this.masterService.GetDesignationByLevelId('mr-IN', 1).subscribe({
      next: (resp: any)=>{
        console.log(" all getDesignationByLevelId:", resp);    
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
        console.log(" all getDistrictDrop:", resp);    
        this.districts = resp.responseData;
      },
      error: ( error : any)=>{
        console.log("error is :", error);  
      }
    });
  }

  submitOfficeData(){
    console.log("all data submitted:", this.officeForm.value);
    this.apiService.setHttp('POST', 'zp_osmanabad/Office/AddOffice', false, this.officeForm.value, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode === "200") {
          this.commonService.snackBar(res.statusMessage, 0);
        }
        else {
          this.commonService.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
        this.dialogRef.close('Yes')
      },
      error: ((error: any) => {
        this.error.handelError(error.status);
      })
    })
  }


}
