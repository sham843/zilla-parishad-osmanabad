import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
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
  constructor(public dialogRef: MatDialogRef<AddUpdateAgencyRegistrationComponent>, private api: ApiService, public webStorageService: WebStorageService,
    private fb: FormBuilder, private master: MasterService, public validation: ValidationService, private ngxSpinner: NgxSpinnerService,
    private common: CommonMethodsService, @Inject(MAT_DIALOG_DATA) public data: any, private errors: ErrorsService) { }

  ngOnInit() {
    this.editData = this.data
    this.defaultForm(this.editData);
    this.getAllDistricts();
    this.getAllTalukas();
  }

  defaultForm(data?: any) {
    this.agencyRegisterForm = this.fb.group({
      ...this.webStorageService.createdByProps(),
      "id": data ? data.id : 0,
      "agency_Name": [data ? data.agency_Name : "", [Validators.required, Validators.pattern(this.validation.fullName)]],
      "m_Agency_Name": [data ? data.m_Agency_Name : "", [Validators.required, Validators.pattern('^[\u0900-\u0965 ]+$')]],
      "contactPerson_Name": [data ? data.contactPerson_Name : "", [Validators.required, Validators.pattern(this.validation.fullName)]],
      "agency_MobileNo": [data ? data.agency_MobileNo : "", [Validators.required, Validators.pattern(this.validation.mobile_No)]],
      "contact_No": [data ? data.contact_No : "", [Validators.required, Validators.pattern(this.validation.mobile_No)]],
      "emailId": [data ? data.emailId : "", [Validators.required, Validators.pattern(this.validation.email)]],
      "agency_EmailId": [data ? data.agency_EmailId : "", [Validators.required, Validators.pattern(this.validation.email)]],
      "address": [data ? data.address : "", [Validators.required, Validators.maxLength(500)]],
      "agency_Address": [data ? data.agency_Address : "", [Validators.required, Validators.maxLength(500)]],
      "districtId": [{ value: 1, disabled: true }],
      "talukaId": ["", Validators.required],
      "lan": this.webStorageService.languageFlag,
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

  onSubmit(clear: any) {
    this.ngxSpinner.show();
    let obj = this.agencyRegisterForm.value;
    obj.districtId = 1;
    if (this.agencyRegisterForm.valid && obj.emailId != obj.agency_EmailId && obj.contact_No != obj.agency_MobileNo) {
      this.api.setHttp(this.data ? 'put' : 'post', 'zp-osmanabad/Agency/' + (this.data ? 'Update' : 'Add'), false, obj, false, 'baseUrl');
      this.api.getHttp().subscribe({
        next: (res: any) => {
          res.statusCode == 200 ? (this.common.showPopup(res.statusMessage, 0), this.dialogRef.close('Yes'), clear.resetForm(), this.ngxSpinner.hide(), this.defaultForm()) : (this.common.showPopup(res.statusMessage, 1), this.ngxSpinner.hide());
          res.statusMessage == "Agency_MobileNo Already Exist." ? this.ngxSpinner.hide() : ''
        },
        error: ((err: any) => { this.errors.handelError(err) })
      })
    }
    else if (this.agencyRegisterForm.invalid) {
      this.common.showPopup(this.webStorageService.languageFlag == 'EN' ? 'Please Enter Mandatory Fields' : 'कृपया अनिवार्य फील्ड प्रविष्ट करा', 1);
      this.ngxSpinner.hide();
      return;
    }
    else {
      obj.emailId == obj.agency_EmailId ? this.common.showPopup(this.webStorageService.languageFlag == 'EN' ? 'Email Id & Agency Email Id Can Not Be Same' : 'ईमेल आयडी आणि एजन्सीचा ईमेल आयडी एकच असू शकत नाही', 1) : '';
      obj.contact_No == obj.agency_MobileNo ? this.common.showPopup(this.webStorageService.languageFlag == 'EN' ? 'Contact Number & Agency Contact Number Can Not Be Same' : 'संपर्क क्रमांक आणि एजन्सीचा संपर्क क्रमांक एकच असू शकत नाही', 1) : '';
      this.ngxSpinner.hide();
      return;
    }
  }
}
