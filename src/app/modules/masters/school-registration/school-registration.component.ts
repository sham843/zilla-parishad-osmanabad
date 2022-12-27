import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { AddUpdateSchoolRegistrationComponent } from './add-update-school-registration/add-update-school-registration.component';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { DownloadPdfExcelService } from 'src/app/core/services/download-pdf-excel.service';

@Component({
  selector: 'app-school-registration',
  templateUrl: './school-registration.component.html',
  styleUrls: ['./school-registration.component.scss']
})
export class SchoolRegistrationComponent {
  pageNumber: number = 1;
  tableDataArray = new Array();
  searchContent = new FormControl('');
  districtId = new FormControl('');
  talukaId = new FormControl('');
  villageId = new FormControl();
  resultDownloadArr = new Array();

  districtArr = new Array();
  talukaArr = new Array();
  villageArr = new Array();
  deleteObj: any;
  cardViewFlag: boolean = false;
  imgPath: any;
  totalCount: number = 0;
  cardCurrentPage: number = 0;
  langTypeName: any;
  displayedColumns = new Array();
  tableDatasize!: Number;
  tableData: any;
  displayedheadersEnglish = ['#', 'Sr. No.', 'Name', 'Village', 'Taluka', 'District', 'Action'];
  displayedheadersMarathi = ['#', 'अनुक्रमांक', 'शाळेचे नाव', 'गाव', 'तालुका', 'जिल्हा', 'कृती'];

  constructor(private dialog: MatDialog, private apiService: ApiService, private errors: ErrorsService,
    private masterService: MasterService, private commonMethodS: CommonMethodsService, public webStorageS: WebStorageService,
    private downloadFileService: DownloadPdfExcelService) { }

  ngOnInit() {
    this.getTableData();
    this.getDistrict();
    this.getofficeReport();
    this.languageChange();
  }

  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData();
  }

  //#region ------------------------------------------- School Registration Table Data start here ----------------------------------------// 
  getTableData(flag?: string) {
    this.tableDataArray = [];
    // if(localStorage.getItem('schoolRegistration')){
    //   this.pageNumber = JSON.parse(localStorage.getItem('schoolRegistration')||'');
    //   localStorage.removeItem('schoolRegistration');
    // }

    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;

    let tableDatasize!: Number;
    let pageNo = this.cardViewFlag ? (this.cardCurrentPage + 1) : this.pageNumber;

    let str = `?pageno=${pageNo}&pagesize=10&DistrictId=${this.districtId.value ? this.districtId.value : 0}
    &TalukaId=${this.talukaId.value ? this.talukaId.value : 0}&VillageId=${this.villageId.value ? this.villageId.value : 0}&lan=${this.webStorageS.languageFlag}`;
    this.apiService.setHttp('GET', 'ZP-Osmanabad/School/GetAll' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({

      next: (res: any) => {
        if (res.statusCode == 200) {
          this.tableDataArray = res.responseData.responseData1;
          this.totalCount = res.responseData.responseData2.pageCount;
          tableDatasize = res.responseData.responseData2.pageCount;
        }
        else {
          this.tableDataArray = [];
          tableDatasize = 0;
        }
        let tableData = {
          pageNumber: this.pageNumber,
          img: 'uploadImage', blink: '', badge: '', isBlock: '', pagintion: true,
          displayedColumns: this.displayedColumns, tableData: this.tableDataArray,
          tableSize: tableDatasize,
          tableHeaders: this.langTypeName == 'English' ? this.displayedheadersEnglish : this.displayedheadersMarathi
        };
        this.apiService.tableData.next(tableData);
      },
      error: ((err: any) => { this.commonMethodS.checkEmptyData(err.statusText) == false ? this.errors.handelError(err.statusCode) : this.commonMethodS.snackBar(err.statusText, 1); })
    });
  }
  //#endregion ------------------------------------------- School Registration Table Data end here ----------------------------------------// 

  //#region ---------------------------------------------- School Registration Dropdown start here ----------------------------------------// 
  getDistrict() {
    this.masterService.getAllDistrict(this.webStorageS.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.districtArr = res.responseData;
        }
      },
      error: ((err: any) => { this.commonMethodS.checkEmptyData(err.statusText) == false ? this.errors.handelError(err.statusCode) : this.commonMethodS.snackBar(err.statusText, 1); })
    });
  }

  getTaluka() {
    this.masterService.getAllTaluka(this.webStorageS.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.talukaArr = res.responseData;
        }
      },
      error: ((err: any) => { this.commonMethodS.checkEmptyData(err.statusText) == false ? this.errors.handelError(err.statusCode) : this.commonMethodS.snackBar(err.statusText, 1); })
    });
  }

  getVillage() {
    let talukaId = this.talukaId.value;
    this.masterService.getAllVillage(this.webStorageS.languageFlag, talukaId).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.villageArr = res.responseData;
        }
      },
      error: ((err: any) => { this.commonMethodS.checkEmptyData(err.statusText) == false ? this.errors.handelError(err.statusCode) : this.commonMethodS.snackBar(err.statusText, 1); })
    });
  }
  //#endregion ------------------------------------------- School Registration Dropdown start here ----------------------------------------// 

  languageChange() {
    this.webStorageS.langNameOnChange.subscribe(lang => {
      this.langTypeName = lang;
      this.displayedColumns = ['uploadImage', 'srNo', this.langTypeName == 'English' ? 'schoolName' : 'm_SchoolName', 'village', 'taluka', 'district', 'action'];
      this.tableData = {
        pageNumber: this.pageNumber,
        img: 'uploadImage', blink: '', badge: '', isBlock: '', pagintion: true,
        displayedColumns: this.displayedColumns, tableData: this.tableDataArray,
        tableSize: this.tableDatasize,
        tableHeaders: this.langTypeName == 'English' ? this.displayedheadersEnglish : this.displayedheadersMarathi
      };
      this.apiService.tableData.next(this.tableData);
    })
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        console.log(obj.pageNumber);
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit' || 'Delete':
        this.addUpdateAgency(obj);
        break;
      case 'Delete':
        this.globalDialogOpen(obj);
        break;
    }
  }

  //#region ------------------------------------------- Open Dialog Box Function start here ----------------------------------------// 
  addUpdateAgency(obj?: any) {
    const dialogRef = this.dialog.open(AddUpdateSchoolRegistrationComponent, {
      width: '820px',
      data: obj,
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'yes' && obj) {
        this.onClear();
        this.getTableData();
        this.pageNumber = this.pageNumber;
        // localStorage.setItem('schoolRegistration',JSON.stringify(this.pageNumber));
      }
      else if(result == 'yes'){
        this.getTableData();
        this.onClear();
        this.pageNumber = 1;
      }
    });
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
  //#endregion ------------------------------------------- Open Dialog Box Function end here ----------------------------------------// 

  onClear() {
    if (this.districtId.value || this.talukaId.value || this.villageId.value) {
      this.districtId.reset();
      this.talukaId.reset();
      this.villageId.reset();
      this.getTableData();
      this.pageNumber = 1;
    }
  }

  //#region ------------------------------------------------- Filter Form start here ------------------------------------------// 
  filterData() {
    if (this.districtId.value || this.talukaId.value || this.villageId.value) {
      this.getTableData();
      this.pageNumber = 1;
        this.getofficeReport();
    }
  }
  //#endregion ---------------------------------------------- Filter Form end here ----------------------------------------// 

  //#region ---------------------------------------------- Delete Record Logic start here ----------------------------------------//  
  onClickDelete() {
    let deleteObj = {
      "id": this.deleteObj.id,
      "modifiedBy": 0,
      "modifiedDate": new Date(),
      "lan": this.webStorageS.languageFlag
    }
    this.apiService.setHttp('delete', 'ZP-Osmanabad/School/Delete', false, deleteObj, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.commonMethodS.snackBar(res.statusMessage, 0);
          this.getTableData();
        }
      }
    })
    error: (error: any) => {
      this.commonMethodS.checkEmptyData(error.statusText) == false ? this.errors.handelError(error.statusCode) : this.commonMethodS.snackBar(error.statusText, 1);
    }
  }
  //#endregion ---------------------------------------------- Delete Record Logic end here ----------------------------------------//  

  onPageChanged(event: any) {
    this.cardCurrentPage = event.pageIndex;
    this.selectGrid('Card');
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

  //#region ---------------------------------------------- PDF Download start here ----------------------------------------// 
  getofficeReport() {
    let str = `?&DistrictId=${this.districtId.value ? this.districtId.value : 0}
     &TalukaId=${this.talukaId.value ? this.talukaId.value : 0}&VillageId=${this.villageId.value ? this.villageId.value : 0}&lan=${this.webStorageS.languageFlag}`;
    this.apiService.setHttp('GET', 'ZP-Osmanabad/School/GetAll' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        console.log("PDF : ",res);
        
        if (res.statusCode == 200) {
          this.resultDownloadArr = [];
          let data: [] = res.responseData.responseData1;
          console.log("data", data);
          
          if(data.length < 0){
            data.map((ele: any, i: any) => {
              let obj = {
                "Sr.No": i + 1,
                "Name": ele.schoolName,
                "District": ele.district,
                "Taluka": ele.taluka,
                "Village": ele.village,
              }
              this.resultDownloadArr.push(obj);
            });
          }
        }
      },
      error: ((err: any) => {
        this.commonMethodS.checkEmptyData(err.statusText) == false ? this.errors.handelError(err.statusCode) : this.commonMethodS.snackBar(err.statusText, 1);
      })
    });
  }

  downloadPdf() {
    let keyPDFHeader = ['SrNo', "Name", "District", "Taluka", "Village"];
    let ValueData =
      this.resultDownloadArr.reduce(
        (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)], []
      );
    let objData: any = {
      'topHedingName': 'School Registration Data',
      'createdDate': 'Created on:' + new Date()
    }
    console.log("ValueData : ",ValueData);
    if(ValueData.length > 0){
      this.downloadFileService.downLoadPdf(keyPDFHeader, ValueData, objData);
    }
    else{
      this.commonMethodS.snackBar("Data not Available", 0);
    }
  }
  //#endregion ---------------------------------------------- PDF Download end here ----------------------------------------// 
}
