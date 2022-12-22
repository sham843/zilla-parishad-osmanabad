import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { DownloadPdfExcelService } from 'src/app/core/services/download-pdf-excel.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { AddUpdateAgencyRegistrationComponent } from './add-update-agency-registration/add-update-agency-registration.component';
// import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-agency-registration',
  templateUrl: './agency-registration.component.html',
  styleUrls: ['./agency-registration.component.scss']
})
export class AgencyRegistrationComponent {
  pageNumber: number = 1;
  filterForm!: FormGroup;
  agencyReport = new Array();
  displayedColumns = new Array();
  tableData: any;
  tableDataArray = new Array();
  tableDatasize!: Number;
  displayedheadersEnglish = ['Sr. No.', 'Name', 'Contact No.', 'Email ID', 'Action'];
  displayedheadersMarathi = ['अनुक्रमांक', 'नाव', 'संपर्क क्र.', 'ई - मेल आयडी', 'कृती'];
  langTypeName: any;

  constructor(private dialog: MatDialog, private apiService: ApiService, private webStroageService: WebStorageService, private downloadPdfservice: DownloadPdfExcelService,
    private errors: ErrorsService, private fb: FormBuilder, private common: CommonMethodsService, public validation: ValidationService,
    ) { }

  ngOnInit() {
    this.filterData();
    this.getTableData();
    this.getTableDataMarathi();
  }

  filterData() {
    this.filterForm = this.fb.group({
      searchText: '',
    })
  }

  getTableDataMarathi(){
    this.webStroageService.langNameOnChange.subscribe(lang => {
      this.langTypeName = lang;
      this.displayedColumns = ['srNo', this.langTypeName == 'English' ? 'agency_Name' : 'm_Agency_Name', 'contact_No','agency_EmailId','action'];
        this.tableData = {
          pageNumber: this.pageNumber,
          img: '', blink: '', badge: '', isBlock: '', pagintion: true,
          displayedColumns: this.displayedColumns, tableData: this.tableDataArray,
          tableSize: this.tableDatasize,
          tableHeaders: this.langTypeName == 'English' ? this.displayedheadersEnglish : this.displayedheadersMarathi,
        };
      this.apiService.tableData.next(this.tableData);
     });
  }

  getTableData(flag?: string) {
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    flag == 'filter' ? this.agencyReport = [] : ''
    // let tableDataArray = new Array();
    // let tableDatasize!: Number;
    let obj = this.filterForm.value;
    let str = `pageno=${this.pageNumber}&pagesize=10&&TextSearch=${obj.searchText}&lan=${this.webStroageService.languageFlag}`;
    let reportStr = `TextSearch=${obj.searchText}`
    this.apiService.setHttp('GET', 'zp-osmanabad/Agency/GetAll?' + (flag == 'reportFlag' ? reportStr : str), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.tableDataArray = res.responseData.responseData1;
          this.tableDatasize = res.responseData.responseData2.pageCount;
          let data: [] = res.responseData.responseData1;
          data.map((ele: any, i: any) => {
            let obj = {
              "Sr.No": i + 1,
              "Name": ele.agency_Name,
              "Contact No": ele.contact_No,
              "Email ID": ele.agency_EmailId,
            }
            this.agencyReport.push(obj);
          });
        } else {
          this.tableDataArray = [];
          this.tableDatasize = 0;
        }
        // let displayedColumns = ['srNo', 'agency_Name', 'contact_No', 'agency_EmailId', 'action'];
        // let displayedheaders = ['Sr. No.', 'Name', 'Contact No.', 'Email ID', 'Action'];
        let tableData = {
          pageNumber: this.pageNumber,
          img: '', blink: '', badge: '', isBlock: '', pagintion: true,
          displayedColumns: this.displayedColumns, tableData: this.tableDataArray,
          tableSize: this.tableDatasize,
          tableHeaders: this.langTypeName == 'English' ? this.displayedheadersEnglish : this.displayedheadersMarathi
        };
        this.apiService.tableData.next(tableData);
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData()
  }

  downloadPdf() {
    this.getTableData('reportFlag')
    let keyPDFHeader = ['SrNo', "Name", "Contact No.", "Email Id"];
    let ValueData =
      this.agencyReport.reduce(
        (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)], []
      );// Value Name
    console.log("ValueData", ValueData);

    let objData: any = {
      'topHedingName': 'Agency Report',
      'createdDate': 'Created on:' + new Date()
    }
    this.downloadPdfservice.downLoadPdf(keyPDFHeader, ValueData, objData);

  }

  onClear() {
    this.filterForm.reset();
    this.filterData();
    this.pageNumber = 1;
    this.getTableData();
    this.agencyReport = [];
  }

  childCompInfo(_obj: any) {
    switch (_obj.label) {
      case 'Pagination':
        this.pageNumber = _obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit':
        this.addUpdateAgency(_obj);
        break;
      case 'Delete':
        this.deleteAgency(_obj);
        break;
      case 'Block':
        // this.globalDialogOpen();
        break;
    }
  }

  addUpdateAgency(_obj?: any) {
    const dialogRef = this.dialog.open(AddUpdateAgencyRegistrationComponent, {
      width: '900px',
      data: _obj,
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      result == 'Yes' ? (this.getTableData()) : '';
    });
  }

  deleteAgencyRow(_obj: any) {
    let obj = {
      "id": _obj.id,
      "modifiedBy": 0,
      "modifiedDate": new Date(),
      "lan": ""
    }

    this.apiService.setHttp('delete', 'zp-osmanabad/Agency/Delete', false, obj, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        res.statusCode == 200 ? (this.common.snackBar(res.statusMessage, 0), this.getTableData()) : this.common.snackBar(res.statusMessage, 1);
      },
      error: ((err: any) => { this.errors.handelError(err) })
    })
  }

  deleteAgency(_obj: any) {
    let dialoObj = {
      header: 'Delete',
      title: 'Do You Want To Delete The Selected Agency ?',
      cancelButton: 'Cancel',
      okButton: 'Ok'
    }
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      result == 'yes' ? this.deleteAgencyRow(_obj) : '';
    });
  }
}

