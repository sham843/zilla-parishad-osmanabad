import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-page-right-access',
  templateUrl: './page-right-access.component.html',
  styleUrls: ['./page-right-access.component.scss']
})
export class PageRightAccessComponent {
  pageNumber: number = 1;
  searchContent = new FormControl('');
  tableData: any;
  UserTypeArr = new Array();
  SubUserTypeArr = new Array();
  userRightFrm !: FormGroup;
  initialLoadFlag: boolean = true;
  tableDataArray = new Array();
  tableDatasize!: Number;
  displayedColumns = new Array();
  displayedheaders = ['Sr. No.', 'Page Name', 'Page URL', 'Select'];
  displayedheadersMarathi = ['अनुक्रमांक', 'पृष्ठाचे नाव', 'पृष्ठ युआरएल','निवडा',];
  
  langTypeName:any;
  constructor(
    private apiService: ApiService, 
    private errors: ErrorsService, 
    private webStorage: WebStorageService,    
    public commonService: MasterService,
    public commonMethods: CommonMethodsService,
    public validation: ValidationService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.assignUserRightsForm();
    this.webStorage.langNameOnChange.subscribe(lang => {
      this.langTypeName = lang;
      this.getTableTranslatedData();
    });
  }

  getTableTranslatedData(){
    this.displayedColumns = ['srNo', this.langTypeName == 'English' ? 'pageName' : 'm_pageName', 'pageURL', 'select'];
      this.tableData = {
        pageNumber: this.pageNumber,
        img: '', blink: '', badge: '', isBlock: '', pagintion: true, checkBox: 'select',
        displayedColumns: this.displayedColumns, tableData: this.tableDataArray,
        tableSize: this.tableDatasize,
        tableHeaders: this.langTypeName == 'English' ? this.displayedheaders : this.displayedheadersMarathi,
      };
    this.apiService.tableData.next(this.tableData);
  }

  getUserType() {
    this.UserTypeArr = [];
    this.SubUserTypeArr = [];
    this.commonService.getAllUserType('').subscribe({
      next: (response: any) => {        
        this.UserTypeArr.push(...response.responseData);        
        if(this.UserTypeArr.length > 0){
          this.userRightFrm.patchValue({
            userType: this.UserTypeArr[0].userTypeId
          })
          this.getSubUserType(this.UserTypeArr[0]?.userTypeId);
        }
      },
      error: ((error: any) => { this.errors.handelError(error.status) })
    })
  }

  getSubUserType(id: any){
    this.SubUserTypeArr = [];
    this.commonService.getAllSubUserTypeById(id).subscribe({
      next: (response: any) => {
        this.SubUserTypeArr.push(...response.responseData);
        if(this.SubUserTypeArr.length > 0){
          this.userRightFrm.patchValue({
            subUserType: this.SubUserTypeArr[0]?.subUserTypeId
          })
          this.initialLoadFlag ? this.getUserRightPageList() : '';
        }
      },
      error: ((error: any) => { this.errors.handelError(error.status) })
    })
  }

  assignUserRightsForm() {
    this.userRightFrm = this.fb.group({
      userType: [''],
      subUserType: [''],
      Textsearch: ['']
    });
    this.getUserType();
  }


  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getUserRightPageList()
  }

  getUserRightPageList(flag?: string) {
    this.tableDataArray = [];
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    let str = 'pageno=' + this.pageNumber + '&TextSearch=' + this.userRightFrm.value.Textsearch + '&UserTypeId=' + this.userRightFrm.value.userType + '&SubUserTypeId=' + this.userRightFrm.value.subUserType;
    this.apiService.setHttp('GET', 'api/UserPages/GetByCriteria?' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({

      next: (res: any) => {
        if (res.statusCode == 200) {
          this.tableDataArray = res.responseData.responseData1;
          this.tableDatasize = res.responseData.responseData2[0].pageCount;
        } else {
          this.tableDataArray = [];
          this.tableDatasize = 0;
        }
        this.getTableTranslatedData();
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });

  }

  onSubmit() {
    this.pageNumber = 1;
    this.getUserRightPageList();
  }

  resetFilter(){
    this.assignUserRightsForm();
    this.getUserType();
    this.pageNumber == 1;
    this.initialLoadFlag = true;
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getUserRightPageList();
        break;
      case 'checkBox':
        let req = {
          ...this.webStorage.createdByProps(),
          "id": obj.id,
          "designationtypeId": obj.designationtypeId,
          "readRight": obj?.checkBoxValue,
          "writeRight": false,
          "pageId": obj.pageId
        }
        this.apiService.setHttp('post', '', false, req, false, 'baseUrl');
        this.apiService.getHttp().subscribe({
          next: ((res: any) => {
            if (res.statusCode == 200) {
              this.getUserRightPageList();
              this.commonMethods.snackBar(res.statusMessage, 0)
            } else {
              this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
            }
          }),
          error: (error: any) => {
            this.commonMethods.checkEmptyData(error.statusText) == false ? this.errors.handelError(error.statusCode) : this.commonMethods.snackBar(error.statusMessage, 1);
          }
        })
        break;
    }
  }
}
