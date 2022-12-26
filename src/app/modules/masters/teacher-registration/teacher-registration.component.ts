import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { DownloadPdfExcelService } from 'src/app/core/services/download-pdf-excel.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { AddUpdateTeacherRegistrationComponent } from './add-update-teacher-registration/add-update-teacher-registration.component';

@Component({
  selector: 'app-teacher-registration',
  templateUrl: './teacher-registration.component.html',
  styleUrls: ['./teacher-registration.component.scss']
})
export class TeacherRegistrationComponent {
  pageNumber: number = 1;
  searchContent = new FormControl('');
  tableDataArray = new Array();
  totalCount: number = 0;
  cardCurrentPage: number = 0;
  deleteObj: any;
  resultDownloadArr = new Array();

  toggleControl = new FormControl(false);
  cardViewFlag: boolean = false;

  @HostBinding('class') className = '';
  constructor(private dialog: MatDialog, private overlay: OverlayContainer, private apiService: ApiService, private errors: ErrorsService,
    private webStorageS: WebStorageService, private downloadFileService: DownloadPdfExcelService, private commonMethodS : CommonMethodsService) {
  }

  ngOnInit(): void {
    this.getTableData();
    this.getofficeReport();

    this.toggleControl.valueChanges.subscribe((darkMode) => {
      const darkClassName = 'darkMode';
      this.className = darkMode ? darkClassName : '';
      if (darkMode) {
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });
  }

  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData()
  }

  getTableData(flag?: string) {
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    let tableDatasize!: Number;
    let pageNo = this.cardViewFlag ? (this.cardCurrentPage + 1) : this.pageNumber;

    let str = `pageno=${pageNo}&pagesize=10&textSearch=${this.searchContent.value}&lan=${this.webStorageS.languageFlag}`;

    this.apiService.setHttp('GET', 'zp_osmanabad/Teacher/GetAll?' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({

      next: (res: any) => {
        if (res.statusCode == "200") {
          this.tableDataArray = res.responseData.responseData1;
          this.totalCount = res.responseData.responseData2.pageCount;
          tableDatasize = res.responseData.responseData2.pageCount;
          console.log("tableDatasize teavche resppp", tableDatasize);

        } else {
          this.tableDataArray = [];
          tableDatasize = 0;
        }
        let displayedColumns = ['srNo', 'name', 'mobileNo', 'emailId', ' ', 'taluka', 'action'];
        let displayedheaders = ['Sr. No.', 'Name', 'Contact No.', 'Email ID', 'Village', 'Taluka', 'action'];
        let tableData = {
          pageNumber: this.pageNumber,
          img: '', blink: '', badge: '', isBlock: '', pagintion: true,
          displayedColumns: displayedColumns, tableData: this.tableDataArray,
          tableSize: tableDatasize,
          tableHeaders: displayedheaders
        };
        this.apiService.tableData.next(tableData);
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }
  childCompInfo(_obj: any) {
    switch (_obj.label) {
      case 'Pagination':
        this.pageNumber = _obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit' || 'Delete':
        this.addUpdateTeacher(_obj);
        break;
      case 'Delete':
        this.globalDialogOpen(_obj);
        break;
    }
  }

  addUpdateTeacher(obj?: any) {
    // let obj: any;
    this.dialog.open(AddUpdateTeacherRegistrationComponent, {
      width: '900px',
      height: '700px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }

  globalDialogOpen(obj: any) {
    this.deleteObj = obj;
    let dialoObj = {
      header: 'Delete',
      title: this.webStorageS.languageFlag == 'EN' ? 'Do you want to delete School record?' : 'तुम्हाला शाळेचा रेकॉर्ड हटवायचा आहे का?',
      cancelButton: this.webStorageS.languageFlag == 'EN' ? 'Cancel' : 'रद्द करा',
      okButton: this.webStorageS.languageFlag == 'EN' ? 'Ok' : 'ओके'
    }

    const deleteDialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false
    })
    deleteDialogRef.afterClosed().subscribe((result: any) => {

      if (result == 'yes') {
        this.onClickDelete();
      }
    })
  }

  onClickDelete() {
    let deleteObj = {
      "id": this.deleteObj.id,
      "modifiedBy": 0,
      "modifiedDate": new Date(),
      "lan": this.webStorageS.languageFlag
    }
    this.apiService.setHttp('delete','zp_osmanabad/Teacher/Delete', false, deleteObj, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next : ( res : any )=>{
        if(res.statusCode == "200"){
          this.commonMethodS.snackBar(res.statusMessage, 0);
          this.getTableData();
        }
      }
    })
    error: (error: any) => {
      this.commonMethodS.checkEmptyData(error.statusText) == false ? this.errors.handelError(error.statusCode) : this.commonMethodS.snackBar(error.statusText, 1);
    }
  }

  getofficeReport() {
    let str = `?&textSearch=${this.searchContent.value}&lan=${this.webStorageS.languageFlag}`;
    this.apiService.setHttp('GET', 'zp_osmanabad/Teacher/GetAll' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.resultDownloadArr = [];
          let data: [] = res.responseData.responseData1;
          data.map((ele: any, i: any) => {
            let obj = {
              "Sr.No": i + 1,
              "Name": ele.name,
              "Contact No.": ele.mobileNo,
              "Email ID": ele.emailId,
              "Village": ele.village,
              "Taluka": ele.taluka,
            }
            this.resultDownloadArr.push(obj);
          });
        }
      },
      error: ((err: any) => { this.errors.handelError(err.message) })
    });
  }

  downloadPdf() {
    let keyPDFHeader = ['SrNo', "Name", "Contact No.", "Email ID", "Village", "Taluka"];
    let ValueData =
      this.resultDownloadArr.reduce(
        (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)], []
      );

    let objData: any = {
      'topHedingName': 'Teacher Registration Data',
      'createdDate': 'Created on:' + new Date()
    }
    this.downloadFileService.downLoadPdf(keyPDFHeader, ValueData, objData);
  }

  onFilterClick() {
    this.pageNumber = 1;
    this.getTableData();
    this.getofficeReport();
  }

  clearFilterData() {
    this.searchContent.setValue('');
    this.getTableData();
  }

  selectGrid(label: string) {
    if (label == 'Table') {
      this.cardViewFlag = false;
      this.pageNumber = 1;
      this.cardCurrentPage = 0;

      this.getTableData();
    } else if (label == 'Card')
      this.cardViewFlag = true;
    this.getTableData();
  }

  onPageChanged(event: any) {
    this.cardCurrentPage = event.pageIndex;
    this.selectGrid('Card');
  }
}
