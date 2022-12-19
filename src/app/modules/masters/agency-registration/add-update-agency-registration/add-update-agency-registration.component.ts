import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MasterService } from 'src/app/core/services/master.service';

@Component({
  selector: 'app-add-update-agency-registration',
  templateUrl: './add-update-agency-registration.component.html',
  styleUrls: ['./add-update-agency-registration.component.scss']
})
export class AddUpdateAgencyRegistrationComponent {
  agencyRegisterForm!: FormGroup;
  districtData = new Array();
  talukaData =  new Array();
  constructor(public dialogRef: MatDialogRef<AddUpdateAgencyRegistrationComponent>, private fb : FormBuilder, private master : MasterService) {}

  ngOnInit(){
    this.defaultForm();
    this.getAllDistricts();
    this.getAllTalukas();
  }

  defaultForm(){
     this.agencyRegisterForm = this.fb.group({
        "createdBy": 0,
        "modifiedBy": 0,
        "createdDate": new Date(),
        "modifiedDate": new Date(),
        "isDeleted": true,
        "id": 0,
        "agency_Name": ["", Validators.required],
        "m_Agency_Name": ["", Validators.required],
        "contactPerson_Name": ["", Validators.required],
        "mobileNo": ["", Validators.required],
        "contact_No": ["", Validators.required],
        "emailId": ["", Validators.required],
        "address": ["", Validators.required],
        "districtId": [{value: 1, disabled: true}],
        "talukaId": ['',Validators.required],
        "lan": ""
     })
  }

  get fc() {return this.agencyRegisterForm.controls}

  getAllDistricts(){
    this.master.getAllDistrict('').subscribe((res:any)=>{
      res.statusCode == 200 ? this.districtData = res.responseData : this.districtData = [];
    })
  }

  getAllTalukas(){
    this.master.getAllTaluka('').subscribe((res:any)=>{
      res.statusCode == 200 ? this.talukaData = res.responseData : this.talukaData = [];
    })
  }

  onCancel(){

  }

  onSubmit(){

    
  }
}
