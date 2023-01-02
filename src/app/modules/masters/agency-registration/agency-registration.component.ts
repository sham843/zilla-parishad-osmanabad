import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
import { AddUpdateAgencyRegistrationComponent } from './add-update-agency-registration/add-update-agency-registration.component';

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
  totalCount: number = 0;
  tableDataArray = new Array();
  tableDatasize!: Number;
  cardViewFlag: boolean = false;
  displayedheadersEnglish = ['Sr. No.', 'Agency Name', 'Agency Mobile No.', 'Email ID', 'Action'];
  displayedheadersMarathi = ['अनुक्रमांक', 'एजन्सी नाव', 'एजन्सी मोबाईल क्र.', 'ई-मेल आयडी', 'कृती'];
  langTypeName: any;

  constructor(private dialog: MatDialog, private apiService: ApiService,  private ngxSpinner: NgxSpinnerService,
     private webStroageService: WebStorageService, private downloadPdfservice: DownloadPdfExcelService,
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

  getTableDataMarathi() {
    this.webStroageService.langNameOnChange.subscribe(lang => {
      this.langTypeName = lang;
      this.displayedColumns = ['srNo', this.langTypeName == 'English' ? 'agency_Name' : 'm_Agency_Name', 'agency_MobileNo', 'agency_EmailId', 'action'];
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
    this.ngxSpinner.show();
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    flag == 'filter' ? this.agencyReport = [] : '';
    if (flag == 'filter' && !this.filterForm.value.searchText) {
      this.ngxSpinner.hide();
      return
    }
    let obj = this.filterForm.value;
    let str = `pageno=${this.pageNumber}&pagesize=10&&TextSearch=${obj.searchText}&lan=${this.webStroageService.languageFlag}`;
    let reportStr = `pageno=${this.pageNumber}&pagesize=${this.totalCount * 10}&TextSearch=${obj.searchText}&lan=${this.webStroageService.languageFlag}`
    this.apiService.setHttp('GET', 'zp-osmanabad/Agency/GetAll?' + ( flag =='pdfFlag' ? reportStr : str ), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.ngxSpinner.hide();
          this.agencyReport = []; 
          flag != 'pdfFlag' ? this.tableDataArray = res.responseData.responseData1 : this.tableDataArray = this.tableDataArray;
          this.tableDatasize = res.responseData.responseData2.pageCount;
          this.totalCount = res.responseData.responseData2.pageCount;          
          let data: [] = res.responseData.responseData1;
          flag =='pdfFlag' ? this.downloadPdf(data): '';
        } else {
          this.ngxSpinner.hide();
          this.tableDataArray = [];
          this.tableDatasize = 0;
          this.tableDatasize == 0 && flag =='pdfFlag' ? this.common.showPopup('No Record Found',1): '';
        }
        this.getTableDataMarathi();
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  downloadPdf(data:any){         
    data.map((ele: any, i: any) => {
      let obj = {
        "Sr.No": i + 1,
        "Name": ele.agency_Name,
        "Contact No": ele.contact_No,
        "Email ID": ele.agency_EmailId,
      }
      this.agencyReport.push(obj);
    });
    if(this.agencyReport.length){
        let keyPDFHeader = ['SrNo', "Name", "Contact No.", "Email Id"];
        let ValueData =
          this.agencyReport.reduce(
            (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)], []
          );
    
        let objData: any = {
          'topHedingName': 'Agency Report',
          'createdDate': 'Created on:' + new Date()
        }
        this.downloadPdfservice.downLoadPdf(keyPDFHeader, ValueData, objData);
      }
      else{
        this.common.showPopup('No Record Found',1)
      }
  }

  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData()
  }

  onClear() {
    if(this.filterForm.value.searchText !=null && this.filterForm.value.searchText != '' ){
    this.filterForm.reset();
    this.filterData();
    this.pageNumber = 1;
    this.getTableData();
  }
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
        break;
        case 'View':
          this.openDetailsDialog(_obj);
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
      result == 'Yes' && _obj ? (this.pageNumber = _obj.pageNumber, this.getTableData()) : (this.pageNumber = 1,this.getTableData());
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
      header: this.langTypeName == 'English' ? 'Delete' :'हटवा',
      title: this.langTypeName == 'English' ?  'Do You Want To Delete The Selected Agency ?': 'तुम्हाला एजन्सी रेकॉर्ड हटवायचा आहे का?',
      cancelButton: this.langTypeName == 'English' ?  'Cancel' : 'रद्द करा',
      okButton: this.langTypeName == 'English' ? 'Ok' :'ओके '
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

  childGridCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit':
        this.addUpdateAgency(obj);
        break;
      case 'Delete':
        this.deleteAgency(obj);
        break;
      case 'View':
        this.openDetailsDialog(obj);
      break;
    }
  }

  openDetailsDialog(obj:any){
    var data = {
      headerImage: "assets/images/user.jpg",
      header: this.webStroageService.languageFlag == 'EN' ? obj.agency_Name : obj.m_Agency_Name,
      subheader: this.webStroageService.languageFlag == 'EN' ? obj.gender : obj.m_Gender,
      labelHeader: this.webStroageService.languageFlag == 'EN' ? ['Mobile Number', 'Email Id','Taluka','District'] : ['मोबाईल क्र.', 'ई-मेल आयडी','तालुका','जिल्हा'],
      labelKey: this.webStroageService.languageFlag == 'EN' ? ['agency_MobileNo', 'agency_EmailId','taluka','district'] : ['agency_MobileNo', 'agency_EmailId','m_Taluka','m_District'],
      Obj: obj,
      chart: false
    }
    const viewDialogRef = this.dialog.open(GlobalDetailComponent, {
      width: '900px',
      height: '650px',
      data: data,
      disableClose: true,
      autoFocus: false
    });
    viewDialogRef.afterClosed().subscribe((result: any) => {
     if (result == 'yes') {
      this.getTableData();
      }
      
    });
}

selectGrid(label: string) {
  if (label == 'Table') {
    this.cardViewFlag = false;
    this.pageNumber = 1;
  } else if (label == 'Card') {
    this.cardViewFlag = true;
    this.pageNumber = 1;
  }
  this.getTableData();
}
}

