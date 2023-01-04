import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { DownloadPdfExcelService } from 'src/app/core/services/download-pdf-excel.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDetailComponent } from 'src/app/shared/components/global-detail/global-detail.component';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { AddUpdateOfficeUsersComponent } from './add-update-office-users/add-update-office-users.component';

@Component({
  selector: 'app-office-users',
  templateUrl: './office-users.component.html',
  styleUrls: ['./office-users.component.scss']
})
export class OfficeUsersComponent {
  cardViewFlag: boolean = false;
  pageNumber: number = 1;
  resultDownloadArr = new Array();
  totalCount: number = 0;
  searchContent = new FormControl('');
  langTypeName : any;
  tableData : any;
  tableDataArray = new Array();
  tableDatasize!: Number;
  displayedColumns = new Array();
  displayedheadersEnglish = ['Sr. No.', ' Office User Name', 'Designation', 'Mobile No.', 'Email ID', 'action'];
  displayedheadersMarathi = ['अनुक्रमांक', 'ऑफिस युजर नाव', 'पदनाम', 'मोबाईल क्र.', 'ई-मेल आयडी', 'कृती'];
  constructor(private apiService: ApiService, private errors: ErrorsService, private dialog: MatDialog, private commonService: CommonMethodsService,
    private webStorageService: WebStorageService, private downloadFileService: DownloadPdfExcelService, public validation  :ValidationService,
    private ngxSpinner: NgxSpinnerService,) { }

  ngOnInit() {
    this.getTableData();
    // this.getofficeReport();
    this.webStorageService.langNameOnChange.subscribe(lang => {
      this.langTypeName = lang;
      this.languageChange();
    });
  }

  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData();
  }

  getTableData(flag?: string) {
    console.log(flag);
    
    this.ngxSpinner.show();
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    // if (flag == 'filter' && !this.searchContent.value) {
    //   this.ngxSpinner.hide();
    //   return
    // }
    let reportStr = `?textSearch=${this.searchContent.value}&pageno=${this.pageNumber}&pagesize=${(this.totalCount * 10)}&lan=${this.webStorageService.languageFlag}`;
    let str = `?textSearch=${this.searchContent.value}&pageno=${this.pageNumber}&pagesize=10&lan=${this.webStorageService.languageFlag}`;
    this.apiService.setHttp('GET', 'zp_osmanabad/Office/GetAllOffice' + (flag == 'reportFlag' ? reportStr : str), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        console.log("Table res : ", res);
        if (res.statusCode == "200") {
          this.ngxSpinner.hide();  
          flag != 'reportFlag' ? this.tableDataArray = res.responseData.responseData1 : this.tableDataArray = this.tableDataArray;
          // this.tableDataArray = res.responseData.responseData1;
          this.tableDatasize = res.responseData.responseData2.pageCount;
          this.totalCount = res.responseData.responseData2.pageCount;
          this.resultDownloadArr = [];
          let data: [] = flag == 'reportFlag' ? res.responseData.responseData1 : [];
          data.find((ele: any, i: any) => {
            let obj = {
              "Sr.No": i+1,
              "name": ele.officeName,
              "designation": ele.designation,
              "mobileNo": ele.mobileNo,
              "emailId": ele.emailId,
            }
            this.resultDownloadArr.push(obj);
          });
          if (this.resultDownloadArr.length > 0) {
            let keyPDFHeader = ['SrNo', "Name", "Designation", "MobileNo","EmailID"];
            let ValueData =
              this.resultDownloadArr.reduce(
                (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)], []
              );       
              let objData:any = {
                'topHedingName': 'Office Data',
                'createdDate':'Created on:'+new Date()
              }
            this.downloadFileService.downLoadPdf(keyPDFHeader, ValueData, objData);
          }
        } else {
          this.ngxSpinner.hide();
          this.tableDataArray = [];
          this.tableDatasize = 0;
          this.tableDatasize == 0 && flag =='reportFlag' ? this.commonService.showPopup('No Record Found',1): '';
        }
        this.languageChange();
      },
      error: ((err: any) => { this.errors.handelError(err.message) })
    });
  }

  languageChange() {
    this.webStorageService.langNameOnChange.subscribe(lang => {
      this.langTypeName = lang;
      this.displayedColumns = ['srNo', this.langTypeName == 'English' ? 'officeName' : 'm_OfficeName', this.langTypeName == 'English' ? 'designation' : 'm_Designation', 'mobileNo', 'emailId', 'action'];
      this.tableData = {
        pageNumber: this.pageNumber,
        img: '', blink: '', badge: '', isBlock: '', pagintion: true,
        displayedColumns: this.displayedColumns, tableData: this.tableDataArray,
        tableSize: this.tableDatasize,
        tableHeaders: this.langTypeName == 'English' ? this.displayedheadersEnglish : this.displayedheadersMarathi
      };
      this.apiService.tableData.next(this.tableData);
    })
  }

  addUpdateOffice(obj?: any) {
    const dialogRef = this.dialog.open(AddUpdateOfficeUsersComponent, {
      width: '900px',
      // height: '300px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe(result => {
      result == 'Yes' ? this.getTableData() : '';
    });
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit':
        this.addUpdateOffice(obj);
        break;
      case 'Delete':
        this.openDeleteDialog(obj);
        break;
      case 'View':
        this.openDetailsDialog(obj);
        break;
    }
  }

  openDeleteDialog(obj?: any) {
    let dialoObj = {
      header: 'Delete Office',
      title: 'Do You Want To Delete The Selected Office ?',
      cancelButton: 'Cancel',
      okButton: 'Ok'
    }
    const deleteDialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false
    })
    deleteDialogRef.afterClosed().subscribe((result: any) => {
      result == 'yes' ? this.deleteOffice(obj) : ''
    })
  }

  deleteOffice(obj: any) {
    let webStorageMethod = this.webStorageService.createdByProps();
    let deleteObj = [{
      "id": obj.id,
      "deletedBy": this.webStorageService.getUserId(),
      "modifiedDate": webStorageMethod.modifiedDate,
      "lan": this.webStorageService.languageFlag
    }]
    console.log("deleteObj", deleteObj);
    this.apiService.setHttp('DELETE', 'zp_osmanabad/Office/DeleteOffice', false, deleteObj, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (resp: any) => {
        resp.statusCode == "200" ? (console.log(resp), this.commonService.snackBar(resp.statusMessage, 0), this.getTableData()) : this.commonService.checkEmptyData(resp.statusMessage) == false ? this.errors.handelError(resp.statusCode) : this.commonService.snackBar(resp.statusMessage, 1);
      },
      error: (err: any) => {
        this.errors.handelError(err.status);
        this.commonService.checkEmptyData(err.status) == false ? this.errors.handelError(err.status) : this.commonService.snackBar(err.status, 1);
      }
    })
  }


  downloadPdf() {
    this.getTableData('reportFlag');
  }

  // filterData(){
  //   this.getTableData();
  //   // this.getofficeReport();
  // }

  clearFilterData() {
      if(this.searchContent.value !=null && this.searchContent.value != '' ){
      this.searchContent.setValue('');
      this.getTableData();
    }
  }
    
    
    // this.getofficeReport();

  selectGrid(label: string) {
    if (label == 'Table') {
      this.cardViewFlag = false;
      this.pageNumber = 1;
    } else if (label == 'Card') {
      this.cardViewFlag = true;
      this.pageNumber = 1;
      // this.cardCurrentPage = this.cardCurrentPage;
    }
    this.getTableData();
  }

  childGridCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        console.log(this.pageNumber);
        
        this.getTableData();
        // this.selectGrid('Card');
        break;
      case 'Edit':
        this.addUpdateOffice(obj);
        break;
      case 'Delete':
        this.openDeleteDialog(obj);
        break;
      case 'View':
        this.openDetailsDialog(obj);
      break;
    }
  }

  openDetailsDialog(obj:any){
    console.log(obj);
    var data = {
      headerImage: "assets/images/user.jpg",
      header: this.webStorageService.languageFlag == 'EN' ? obj.officeName : obj.m_OfficeName,
      subheader: this.webStorageService.languageFlag == 'EN' ? obj.designation : obj.m_Designation,
      labelHeader: this.webStorageService.languageFlag == 'EN' ? ['Mobile Number', 'Email Id','DesignationLevel','Taluka','District'] : ['मोबाईल क्र.', 'ई-मेल आयडी','पदनाम स्तर','तालुका','जिल्हा'],
      labelKey: this.webStorageService.languageFlag == 'EN' ? ['mobileNo', 'emailId', 'designationLevel','taluka','district'] : ['mobileNo', 'emailId','m_DesignationLevel','m_Taluka','m_District'],
      Obj: obj,
      chart: false
    }
    const viewDialogRef = this.dialog.open(GlobalDetailComponent, {
      width: '900px',
      
      data: data,
      disableClose: true,
      autoFocus: false
    });
    viewDialogRef.afterClosed().subscribe((result: any) => {
     if (result == 'Yes') {
      this.getTableData();
      }
    });
}

}