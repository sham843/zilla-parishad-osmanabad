import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  constructor(private masterService: MasterService,
              private fb: FormBuilder){}


  ngOnInit(){
    this.getLevelDrop();
    this.defaultForm()
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
        "lan": [""]
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
        console.log(" all getLevelDrop:", resp);    
        this.designations = resp.responseData;
      },
      error: ( error : any)=>{
        console.log("error is :", error);  
      }
    }) 
  }


}
