import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

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
  constructor(public dialogRef: MatDialogRef<AddUpdateAgencyRegistrationComponent>, private api: ApiService, public webStorageService : WebStorageService,
    private fb: FormBuilder, private master: MasterService, public validation: ValidationService,
    private common: CommonMethodsService, @Inject(MAT_DIALOG_DATA) public data: any, private errors: ErrorsService) { }

  ngOnInit() {
    this.editData = this.data
    this.defaultForm(this.editData);
    this.getAllDistricts();
    this.getAllTalukas();
  }

  defaultForm(data?: any) {
  //  let obj = this.webStorageService.createdByProps();
    this.agencyRegisterForm = this.fb.group({
      // "createdBy": obj.createdBy,
      // "modifiedBy": obj.modifiedBy,
      // "createdDate": obj.createdDate,
      // "modifiedDate": obj.modifiedDate,
      // "isDeleted": obj.isDeleted,
      ...this.webStorageService.createdByProps(),
      "id": data ? data.id : 0,
      "agency_Name": [data ? data.agency_Name : "", [Validators.required, Validators.pattern(this.validation.fullName)]],
      "m_Agency_Name": [data ? data.m_Agency_Name : "", Validators.required],
      "contactPerson_Name": [data ? data.contactPerson_Name : "", [Validators.required, Validators.pattern(this.validation.fullName)]],
      "agency_MobileNo": [data ? data.agency_MobileNo : "", [Validators.required, Validators.pattern(this.validation.mobile_No)]],
      "contact_No": [data ? data.contact_No : "", [Validators.required, Validators.pattern(this.validation.mobile_No)]],
      "emailId": [data ? data.emailId : "", [Validators.required, Validators.pattern(this.validation.email)]],
      "agency_EmailId": [data ? data.agency_EmailId : "", [Validators.required, Validators.pattern(this.validation.email)]],
      "address": [data ? data.address : "", [Validators.required, Validators.maxLength(500)]],
      "districtId": [{ value: 1, disabled: true }],
      "talukaId": ["", Validators.required],
      "lan": "",
      "localID": 0,
      "timestamp": new Date()
    })
    data ? this.getAllTalukas() : ''
  }

  get fc() { return this.agencyRegisterForm.controls }

  getAllDistricts() {
    this.master.getAllDistrict(this.webStorageService.languageFlag).subscribe((res: any) => {
      res.statusCode == 200 ? this.districtData = res.responseData : this.districtData = [];
    })
  }

  getAllTalukas() {
    this.master.getAllTaluka(this.webStorageService.languageFlag).subscribe((res: any) => {
      res.statusCode == 200 ? (this.talukaData = res.responseData, this.editData ? this.fc['talukaId'].setValue(this.editData.talukaId) : '') : this.talukaData = [];
    })
  }

  onCancel(clear: any) {
    clear.resetForm();
    this.data = '';
    this.editData = '';
    this.defaultForm();
  }

  onSubmit(clear: any) {
    let obj = this.agencyRegisterForm.value;
    obj.districtId = 1;
    if (this.agencyRegisterForm.valid) {
      this.api.setHttp(this.data ? 'put' : 'post', this.data ? 'zp-osmanabad/Agency/Update' : 'zp-osmanabad/Agency/Add', false, obj, false, 'baseUrl');
      this.api.getHttp().subscribe({
        next: (res: any) => {
          res.statusCode == 200 ? (this.common.snackBar(res.statusMessage, 0), this.dialogRef.close('Yes'), clear.resetForm(), this.defaultForm()) : this.common.snackBar(res.statusMessage, 1);
        },
        error: ((err: any) => { this.errors.handelError(err) })
      })
    }
    else {
      return;
    }
  }
}
