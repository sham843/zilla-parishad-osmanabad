import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { DownloadPdfExcelService } from 'src/app/core/services/download-pdf-excel.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { AddUpdateStudentRegistrationComponent } from './add-update-student-registration/add-update-student-registration.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.scss']
})
export class StudentRegistrationComponent {
  pageNumber: number = 1;
  searchContent = new FormControl('');
  tableDataArray = new Array();
  tableDataForcard: any;
  cardViewFlag: boolean = false;
  totalCount: number = 0;
  cardCurrentPage: number = 0;
  studentData = new Array();
  languageFlag!: string
  tableDatasize!: Number;

  displayedColumns = ['docPath', 'srNo', 'fullName', 'standard', 'parentMobileNo', 'gender', 'action'];
  marathiDisplayedColumns = ['docPath', 'srNo', 'm_FullName', 'm_Standard', 'parentMobileNo', 'm_Gender', 'action'];
  displayedheaders = ['#', 'Sr.No.', 'Name', 'Standard', 'Parents Contact No.', 'Gender', 'action'];
  marathiDisplayedheaders = ['#', 'अनुक्रमांक', 'नाव', 'वर्ग', 'पालक संपर्क क्र', 'लिंग', 'क्रिया'];
  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private errors: ErrorsService,
    private commonMethods: CommonMethodsService,
    private webService: WebStorageService,
    private downloadPdfservice: DownloadPdfExcelService) { }

  ngOnInit() {
    this.languageFlag = this.webService.languageFlag;
    console.log(this.languageFlag);
    
    this.getTableData();
    this.languageChange();
  }

  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData();
    
  }

  languageChange() {
    this.webService.langNameOnChange.subscribe(lang => {
      this.languageFlag = lang;  
      let tableData = {
        pageNumber: this.pageNumber,
        img: '', blink: '', badge: '', isBlock: '', pagintion: true,
        displayedColumns: this.languageFlag == 'EN' ? this.displayedColumns : this.marathiDisplayedColumns,
        tableData: this.tableDataArray,
        tableSize: this.tableDatasize,
        tableHeaders: this.languageFlag == 'EN' ? this.displayedheaders : this.marathiDisplayedheaders
      };
      this.apiService.tableData.next(tableData);
    });
  }

  getTableData(flag?: string) {

    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    this.tableDataArray = new Array();
    let pageNo
    this.cardViewFlag ? pageNo = (this.cardCurrentPage + 1) : (pageNo = this.pageNumber, this.cardCurrentPage = 0);
    let str = `?pageno=${pageNo}&pagesize=10&textSearch=${this.searchContent.value || ''}&lan=${this.languageFlag || ''}`;
    let reportStr = `?TextSearch=${this.searchContent.value}`
    this.apiService.setHttp('GET', 'zp-osmanabad/Student/GetAll' + (flag == 'reportFlag' ? reportStr : str), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.tableDataArray = res.responseData.responseData1;
          this.totalCount = res.responseData.responseData2.pageCount;
          this.tableDatasize = res.responseData.responseData2.pageCount;
          this.studentData = []
          let data: [] = res.responseData.responseData1;
          data.find((ele: any, i: any) => {
            let obj = {
              srNo: i + 1,
              id: ele.id,
              fullName: this.languageFlag == 'EN' ? ele.fullName : ele.m_FullName,
              gender: this.languageFlag == 'EN' ? ele.gender : ele.m_Gender,
              mobileNo: ele.parentMobileNo,
              standard: this.languageFlag == 'EN' ? ele.standard : ele.m_Standard,
              schoolName: this.languageFlag == 'EN' ? ele.schoolName : ele.m_SchoolName,
              caste: this.languageFlag == 'EN' ? ele.caste : ele.m_Caste,
              taluka: this.languageFlag == 'EN' ? ele.taluka : ele.m_Taluka,
              center: this.languageFlag == 'EN' ? ele.center : ele.m_Center,
            }            
            this.studentData.push(obj);
          });

        } else {
          this.tableDataArray = [];
          this.tableDatasize = 0;
        }
        
          let tableData = {
            pageNumber: this.pageNumber,
            img: 'docPath', blink: '', badge: '', isBlock: '', pagintion: this.tableDatasize > 10 ? true : false,
            displayedColumns: this.languageFlag == 'EN' ? this.displayedColumns : this.marathiDisplayedColumns,
            tableData: this.tableDataArray,
            tableSize: this.tableDatasize,
            tableHeaders: this.languageFlag == 'EN' ? this.displayedheaders : this.marathiDisplayedheaders
          };
  
          this.tableDataForcard = {
            pageNumber: this.pageNumber,
            tableData: this.tableDataArray,
            tableSize: this.tableDatasize,
          };
          this.apiService.tableData.next(tableData);     

      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  addUpdateAgency(obj?: any) {
    console.log(obj);
    const dialogRef = this.dialog.open(AddUpdateStudentRegistrationComponent, {
      width: '900px',
      height: '650px',
      data: obj,
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(this.pageNumber);

      console.log(result);
      if (result == 'yes' && obj) {
        this.pageNumber = obj.pageNumber || 1;
      } else if (result == 'yes') {
        this.pageNumber = 1;
      }
      this.getTableData();

    });
  }

  deteleDialogOpen(obj: any) {
    let dialoObj = {
      header: this.languageFlag == 'EN' ? 'Delete' : 'हटवा',
      title: this.languageFlag == 'EN' ? 'Do you want to delete Student record?' :'तुम्हाला विद्यार्थी रेकॉर्ड हटवायचा आहे का?',
      cancelButton: this.languageFlag == 'EN' ? 'Cancel':'रद्द करा',
      okButton: this.languageFlag == 'EN' ? 'Ok':'ओके'
    }

    const deleteDialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false
    })
    deleteDialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'yes') {
        this.deleteRecord(obj.id)
      }
    })
  }

  deleteRecord(id: any) {
    let deleteObj = {
      "id": id,
      "modifiedBy": 0,
      "modifiedDate": "2022-12-21T12:30:51.962Z",
      "lan": "string"
    }
    this.apiService.setHttp('delete', 'zp-osmanabad/Student/DeleteStudent', false, deleteObj, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.commonMethods.snackBar(res.statusMessage, 0);
          this.getTableData();
        } else {
          this.commonMethods.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });

  }

  childTableCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit':
        this.addUpdateAgency(obj);
        break;
      case 'Delete':
        this.deteleDialogOpen(obj);
        break;
    }
  }

  childGridCompInfo(obj: any) {
    if (obj.label = 'Pagination') {
      this.pageNumber = obj.pageNumber;
      this.getTableData();
    }

  }

  onPageChanged(event: any) {
    this.cardCurrentPage = event.pageIndex;
    this.selectGrid('Card');
  }

  selectGrid(label: string) {
    if (label == 'Table') {
      this.cardViewFlag = false;
      this.pageNumber = 1;
      this.getTableData()
    } else if (label == 'Card')
      this.cardViewFlag = true;
    this.cardCurrentPage = this.cardCurrentPage;
    this.getTableData();
  }

  clearForm() {
    this.searchContent.setValue('');
    this.getTableData();
  }

  downloadPdf() {
    this.getTableData('reportFlag')
    let keyPDFHeader = ['SrNo', "ID", "Full Name", "Gender", "Contact No.", "Standard", "School Name", "Caste", "Taluka","Center"];
    let ValueData =
      this.studentData.reduce(
        (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)], []
      );// Value Name
    console.log("ValueData", ValueData);

    let objData: any = {
      'topHedingName': 'Student Report',
      'createdDate': 'Created on:' + new Date()
    }
    this.downloadPdfservice.downLoadPdf(keyPDFHeader, ValueData, objData);
  }


  openViewDilog(obj:any){
    const viewDialogRef = this.dialog.open(StudentDetailsComponent, {
      width: '950px',
      height: '650px',
      data: obj,
      disableClose: true,
      autoFocus: false
    });
    viewDialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'yes') {
        console.log(result);
        
      }
    })
  }

}
