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
import { AddUpdateStudentRegistrationComponent } from './add-update-student-registration/add-update-student-registration.component';
// import { StudentDetailsComponent } from './student-details/student-details.component';
@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.scss']
})
export class StudentRegistrationComponent {
  pageNumber: number = 1;
  searchContent = new FormControl('');
  tableDataArray = new Array();
  cardViewFlag: boolean = false;
  totalCount: number = 0;
  cardCurrentPage: number = 0;
  studentData = new Array();
  languageFlag!: string;
  tableDatasize!: Number;

  displayedColumns = ['docPath', 'srNo', 'fullName', 'standard', 'parentMobileNo', 'gender', 'action'];
  marathiDisplayedColumns = ['docPath', 'srNo', 'm_FullName', 'm_Standard', 'parentMobileNo', 'm_Gender', 'action'];
  displayedheaders = ['#', 'Sr. No.', 'Name', 'Standard', 'Parents Contact No.', 'Gender', 'action'];
  marathiDisplayedheaders = ['#', 'अनुक्रमांक', 'नाव', 'वर्ग', 'पालक संपर्क क्र.', 'लिंग', 'कृती'];
  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private errors: ErrorsService,
    private commonMethods: CommonMethodsService,
    private webService: WebStorageService,
    private downloadPdfservice: DownloadPdfExcelService,
    private ngxSpinner: NgxSpinnerService,
    public validators: ValidationService
  ) { }

  ngOnInit() {
    this.languageFlag = this.webService.languageFlag;
    this.languageChange();
    this.getTableData();

  }

  //#region ----------------------------------------------------- Language Change Logic Start here -----------------------------------------------

  languageChange() {
    this.webService.langNameOnChange.subscribe(lang => {
      this.languageFlag = lang;
      let tableData = {
        pageNumber: this.pageNumber,
        img: 'docPath', blink: '', badge: '', isBlock: '', pagintion: true,
        displayedColumns: this.languageFlag == 'English' ? this.displayedColumns : this.marathiDisplayedColumns,
        tableData: this.tableDataArray,
        tableSize: this.tableDatasize,
        tableHeaders: this.languageFlag == 'English' ? this.displayedheaders : this.marathiDisplayedheaders
      };
      this.apiService.tableData.next(tableData);
    });
  }

  //#endregion ----------------------------------------------------- Language Change Logic End here -----------------------------------------------

  //#region ----------------------------------------------------- Get Table Data Logic Start here -----------------------------------------------

  getTableData(flag?: string) {
    this.ngxSpinner.show();
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    if (flag == 'filter' && !this.searchContent.value) {
      this.ngxSpinner.hide();
      return
    }
    let pageNo
    this.cardViewFlag ? pageNo = (this.cardCurrentPage + 1) : (pageNo = this.pageNumber, this.cardCurrentPage = 0);
    let str = `?pageno=${pageNo}&pagesize=10&textSearch=${this.searchContent.value || ''}&lan=${this.languageFlag || ''}`;
    let reportStr = '?pageno=1&pagesize=' + (this.totalCount * 10) + '&textSearch=' + this.searchContent.value + '&lan=' + this.languageFlag;
    this.apiService.setHttp('GET', 'zp-osmanabad/Student/GetAll' + (flag == 'reportFlag' ? reportStr : str), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.ngxSpinner.hide();
          flag != 'reportFlag' ? this.tableDataArray = res.responseData.responseData1 : this.tableDataArray = this.tableDataArray;
          this.tableDataArray.map((res: any) => {
          let  index = res.documentResponse.findIndex((ele:any)=> ele.documentId == 1);
            res.docPath = res.documentResponse[index]?.docPath
          })
          this.totalCount = res.responseData.responseData2.pageCount;
          this.tableDatasize = res.responseData.responseData2.pageCount;
          this.studentData = []
          let data: [] = flag == 'reportFlag' ? res.responseData.responseData1 : [];
          data.find((ele: any, i: any) => {
            let obj = {
              srNo: i + 1,
              id: ele.id,
              fullName: ele.fullName,
              gender: ele.gender,
              mobileNo: ele.parentMobileNo,
              standard: ele.standard,
              schoolName: ele.schoolName,
              caste: ele.caste,
              taluka: ele.taluka,
              center: ele.center,
            }
            this.studentData.push(obj);
          });
          if (this.studentData.length > 0) {
            let keyPDFHeader = ['SrNo', "ID", "Full Name", "Gender", "Contact No.", "Standard", "School Name", "Caste", "Taluka", "Center"];
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
          } else {
            flag == 'reportFlag' ? this.commonMethods.snackBar("No Data Found", 1) :'';
          }

        } else {
          this.ngxSpinner.hide();
          this.tableDataArray = [];
          this.tableDatasize = 0;
        }

        let tableData = {
          pageNumber: this.pageNumber,
          img: 'docPath', blink: '', badge: '', isBlock: '', pagintion: this.tableDatasize > 10 ? true : false,
          displayedColumns: this.languageFlag == 'English' ? this.displayedColumns : this.marathiDisplayedColumns,
          tableData: this.tableDataArray,
          tableSize: this.tableDatasize,
          tableHeaders: this.languageFlag == 'English' ? this.displayedheaders : this.marathiDisplayedheaders
        };
        this.apiService.tableData.next(tableData);

      },
      error: ((err: any) => { this.ngxSpinner.hide(); this.errors.handelError(err) })
    });
  }
  //#endregion ----------------------------------------------------- Get Table Data Logic End here -----------------------------------------------

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
        case 'View':
        this.openDetailsDialog(obj);
        break;
    }
  }

  addUpdateAgency(obj?: any) {
    console.log(obj);
    const dialogRef = this.dialog.open(AddUpdateStudentRegistrationComponent, {
      width: '900px',
      // height: '650px',
      data: obj,
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'yes' && obj) {
        this.pageNumber = obj.pageNumber;
        this.getTableData();
      } else if (result == 'yes') {
        this.pageNumber = 1;
        this.getTableData();
      }
    });
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
    } else if (label == 'Card') {
      this.cardViewFlag = true;
      this.cardCurrentPage = this.cardCurrentPage;
    }
    this.getTableData();
  }

  clearForm() {
    this.searchContent.setValue('');
    this.getTableData();
  }

  openDetailsDialog(obj:any){
      console.log(obj);
      var data = {
        headerImage: obj.documentResponse[0].docPath,
        header: this.webService.languageFlag == 'EN' ? obj.fullName : obj.m_FullName,
        subheader: this.webService.languageFlag == 'EN' ? obj.gender : obj.m_Gender,
        labelHeader: this.webService.languageFlag == 'EN' ? ['Father Name', 'Parent Mobile No.'] : ['वडीलांचे नावं', 'पालक मोबाईल क्र.'],
        labelKey: this.webService.languageFlag == 'EN' ? ['fatherFullName', 'parentMobileNo'] : ['m_FatherFullName', 'parentMobileNo'],
        Obj: obj
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

 
  //#region -------------------------------------------------- Delete Logic Start Here ------------------------------------------------------

  deteleDialogOpen(obj: any) {
    let dialoObj = {
      header: this.languageFlag == 'English' ? 'Delete' : 'हटवा',
      title: this.languageFlag == 'English' ? 'Do you want to delete Student record?' : 'तुम्हाला विद्यार्थी रेकॉर्ड हटवायचा आहे का?',
      cancelButton: this.languageFlag == 'English' ? 'Cancel' : 'रद्द करा',
      okButton: this.languageFlag == 'English' ? 'Ok' : 'ओके'
    };
    const deleteDialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false
    });
    deleteDialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'yes') {
        this.deleteRecord(obj.id)
      }
    });
  }

  deleteRecord(id: any) {
    let deleteObj = {
      "id": id,
      "modifiedBy": this.webService.getUserId(),
      "modifiedDate": new Date(),
      "lan": this.languageFlag == 'English' ? 'EN' : 'mr-IN'
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
  //#endregion -------------------------------------------------- Delete Logic End Here ------------------------------------------------------

  downloadPdf() {
    this.getTableData('reportFlag')
    // if (this.studentData.length > 0) {
    //   let keyPDFHeader = ['SrNo', "ID", "Full Name", "Gender", "Contact No.", "Standard", "School Name", "Caste", "Taluka", "Center"];
    //   let ValueData =
    //     this.studentData.reduce(
    //       (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)], []
    //     );// Value Name
    //   console.log("ValueData", ValueData);
    //   let objData: any = {
    //     'topHedingName': 'Student Report',
    //     'createdDate': 'Created on:' + new Date()
    //   }
    //   this.downloadPdfservice.downLoadPdf(keyPDFHeader, ValueData, objData);
    // } else {
    //   this.commonMethods.snackBar("No Data Found", 1);
    // }
  }

}
