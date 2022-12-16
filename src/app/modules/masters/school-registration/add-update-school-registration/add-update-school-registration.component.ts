import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';

@Component({
  selector: 'app-add-update-school-registration',
  templateUrl: './add-update-school-registration.component.html',
  styleUrls: ['./add-update-school-registration.component.scss']
})
export class AddUpdateSchoolRegistrationComponent {
  districtArr = new Array();
  talukaArr = new Array();
  centerArr = new Array();
  groupclassArr = new Array();
  schoolRegForm !: FormGroup;

  constructor(private masterService: MasterService, private errors: ErrorsService, private fb: FormBuilder) { }

  ngOnInit() {
    this.formFeild();
    this.getDistrict();
    this.getTaluka();
    this.getCenter();
    this.getGroupClass();
  }

  formFeild() {
    this.schoolRegForm = this.fb.group({
      "createdBy": 0,
      "modifiedBy": 0,
      "createdDate": new Date(),
      "modifiedDate": new Date(),
      "isDeleted": false,
      "id": 0,
      "schoolName": [''],
      "m_SchoolName": [''],
      "stateId": 0,
      "districtId": [''],
      "talukaId": [''],
      "villageId": 0,
      "centerId": [''],
      "s_CategoryId": 0,
      "s_ManagementId": 0,
      "s_TypeId": 0,
      "g_ClassId": ['']
    })
  }

  getDistrict() {
    this.masterService.getAllDistrict('').subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.districtArr = res.responseData;
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getTaluka() {
    this.masterService.getAllTaluka('1').subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.talukaArr = res.responseData;
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getCenter() {
    this.masterService.getAllCenter('1').subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.centerArr = res.responseData;
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getGroupClass() {
    this.masterService.getAllGroupClass('1').subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.groupclassArr = res.responseData;
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  



}
