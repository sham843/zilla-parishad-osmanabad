import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';

@Component({
  selector: 'app-add-update-agency-registration',
  templateUrl: './add-update-agency-registration.component.html',
  styleUrls: ['./add-update-agency-registration.component.scss']
})
export class AddUpdateAgencyRegistrationComponent {
  agencyRegisterForm!: FormGroup;
  districtData = new Array();
  talukaData = new Array();
  editData: any;
  constructor(public dialogRef: MatDialogRef<AddUpdateAgencyRegistrationComponent>, private api: ApiService,
    private fb: FormBuilder, private master: MasterService, public validation: ValidationService,
    private common: CommonMethodsService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.editData = this.data
    this.defaultForm(this.editData);
    this.getAllDistricts();
    this.getAllTalukas();
  }

  defaultForm(data?: any) {
    this.agencyRegisterForm = this.fb.group({
      "createdBy": 0,
      "modifiedBy": 0,
      "createdDate": new Date(),
      "modifiedDate": new Date(),
      "isDeleted": true,
      "id": 0,
      "agency_Name": [data ? data.agency_Name : "", [Validators.required, Validators.pattern(this.validation.fullName)]],
      "m_Agency_Name": [data ? data.m_Agency_Name : ""],
      "contactPerson_Name": [data ? data.contactPerson_Name : "", [Validators.required, Validators.pattern(this.validation.fullName)]],
      "agency_MobileNo": [data ? data.agency_MobileNo : "", [Validators.required, Validators.pattern(this.validation.mobile_No)]],
      "contact_No": [data ? data.contact_No : "", [Validators.required, Validators.pattern(this.validation.mobile_No)]],
      "emailId": [data ? data.emailId : "", [Validators.required, Validators.pattern(this.validation.email)]],
      "agency_EmailId": [data ? data.agency_EmailId : "", [Validators.required, Validators.pattern(this.validation.email)]],
      "address": [data ? data.address : "", [Validators.required, Validators.maxLength(500)]],
      "districtId": [{ value: 1, disabled: true }],
      "talukaId": [data ? data.talukaId : "", Validators.required],
      "lan": "",
      "localID": 0,
      "timestamp": new Date()
    })
  }

  get fc() { return this.agencyRegisterForm.controls }

  getAllDistricts() {
    this.master.getAllDistrict('').subscribe((res: any) => {
      res.statusCode == 200 ? this.districtData = res.responseData : this.districtData = [];
    })
  }

  getAllTalukas() {
    this.master.getAllTaluka('').subscribe((res: any) => {
      res.statusCode == 200 ? this.talukaData = res.responseData : this.talukaData = [];
    })
  }

  onCancel(clear: any) {
    clear.resetForm();
    this.data = '';
    this.defaultForm();
  }

  onSubmit(clear: any) {
    let obj = this.agencyRegisterForm.value;
    obj.districtId = 1;
    this.data ? obj.id = this.editData.id : '';
    this.api.setHttp(this.data ? 'put' : 'post', this.data ? 'zp-osmanabad/Agency/Update' : 'zp-osmanabad/Agency/Add', false, obj, false, 'baseUrl');
    this.api.getHttp().subscribe({
      next: (res: any) => {
        res.statusCode == 200 ? (this.common.snackBar(res.statusMessage, 0), this.dialogRef.close('Yes'), clear.resetForm(), this.defaultForm()) : this.common.snackBar(res.statusMessage, 1);
      }
    })
  }
}
