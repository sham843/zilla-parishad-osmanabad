import { Component, OnInit } from '@angular/core';
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
import { GlobalDetailComponent } from 'src/app/shared/components/global-detail/global-detail.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-school-registration',
  templateUrl: './school-registration.component.html',
  styleUrls: ['./school-registration.component.scss']
})
export class SchoolRegistrationComponent implements OnInit {
  pageNumber: number = 1;
  tableDataArray = new Array();
  // searchContent = new FormControl('');
  districtId = new FormControl(null);
  talukaId = new FormControl(0);
  villageId = new FormControl(0);
  resultDownloadArr = new Array();

  districtArr = new Array();
  talukaArr = new Array();
  villageArr = new Array();
  deleteObj: any;
  cardViewFlag: boolean = false;
  imgPath: any;
  totalCount: number = 0;
  langTypeName: any;
  displayedColumns = new Array();
  tableDatasize!: Number;
  tableData: any;
  displayedheadersEnglish = ['#', 'Sr. No.', 'School Name', 'District', 'Taluka', 'Village', 'Action'];
  displayedheadersMarathi = ['#', 'अनुक्रमांक', 'शाळेचे नाव', 'जिल्हा', 'तालुका', 'गाव',  'कृती'];

  constructor(private dialog: MatDialog, 
    private apiService: ApiService, 
    private errors: ErrorsService,
    private masterService: MasterService, 
    private commonMethodS: CommonMethodsService, 
    public webStorageS: WebStorageService,
    private downloadFileService: DownloadPdfExcelService,
    private ngxSpinner: NgxSpinnerService,
    public datepipe : DatePipe
    ) { }

  ngOnInit() {
    this.getTableData();
    this.getDistrict();
    // this.getofficeReport();
    this.webStorageS.langNameOnChange.subscribe(lang => {
      this.langTypeName = lang;
      this.languageChange();
    });
  }

  // onPagintion(pageNo: number) {
  //   this.pageNumber = pageNo;
  //   this.getTableData();
  // }

  //#region ------------------------------------------- School Registration Table Data start here ----------------------------------------// 

  languageChange() {
      this.displayedColumns = ['uploadImage', 'srNo', this.langTypeName == 'English' ? 'schoolName' : 'm_SchoolName', this.langTypeName == 'English' ? 'district' : 'm_District', this.langTypeName == 'English' ? 'taluka' : 'm_Taluka', this.langTypeName == 'English' ? 'village' : 'm_Village', 'action'];
      this.tableData = {
        pageNumber: this.pageNumber,
        img: 'uploadImage', blink: '', badge: '', isBlock: '', pagintion: true,
        displayedColumns: this.displayedColumns, tableData: this.tableDataArray,
        tableSize: this.tableDatasize,
        tableHeaders: this.langTypeName == 'English' ? this.displayedheadersEnglish : this.displayedheadersMarathi
      };
      this.apiService.tableData.next(this.tableData);
  }

  getTableData(flag?: string) {
    // this.tableDataArray = [];
    this.ngxSpinner.show();
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    let pageNo = this.cardViewFlag ? (this.pageNumber) : this.pageNumber;
    let str = `?pageno=${pageNo}&pagesize=10&DistrictId=${this.districtId.value ? this.districtId.value : 0}
    &TalukaId=${this.talukaId.value ? this.talukaId.value : 0}&VillageId=${this.villageId.value ? this.villageId.value : 0}&lan=${this.webStorageS.languageFlag}`;

    let reportStr = `?pageno=1&pagesize=` + (this.totalCount * 10) + `&DistrictId=${this.districtId.value ? this.districtId.value : 0}
    &TalukaId=${this.talukaId.value ? this.talukaId.value : 0}&VillageId=${this.villageId.value ? this.villageId.value : 0}&lan=${this.webStorageS.languageFlag}`;

    this.apiService.setHttp('GET', 'ZP-Osmanabad/School/GetAll' + (flag == 'pdfFlag' ? reportStr : str), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({

      next: (res: any) => {
        if (res.statusCode == 200) {
          this.ngxSpinner.hide();
          flag != 'pdfFlag' ? this.tableDataArray = res.responseData.responseData1 : this.tableDataArray = this.tableDataArray;
          this.totalCount = res.responseData.responseData2.pageCount;
          this.tableDatasize = res.responseData.responseData2.pageCount;
          this.resultDownloadArr = [];
          let data: [] = flag == 'pdfFlag' ? res.responseData.responseData1 : [];
          flag == 'pdfFlag' ? this.downloadPdf(data) : '';
        }
        else {
          this.ngxSpinner.hide();
          this.tableDataArray = [];
          this.tableDatasize = 0;
          this.tableDatasize == 0 && flag == 'pdfFlag' ? this.commonMethodS.showPopup(this.webStorageS.languageFlag == 'EN' ? 'No Record Found' : 'रेकॉर्ड उपलब्ध नाही', 1) : '';
        }
        this.languageChange();
      },
      error: ((err: any) => { this.commonMethodS.checkEmptyData(err.statusText) == false ? this.errors.handelError(err.statusCode) : this.commonMethodS.showPopup(err.statusText, 1); })
    });
  }
  //#endregion ------------------------------------------- School Registration Table Data end here ----------------------------------------// 

   //#endregion ---------------------------------------------- PDF Download start here ----------------------------------------// 

   downloadPdf(data: any){
    data.find((ele: any, i: any) => {
      let obj = {
        srNo: i + 1,
        schoolName: ele.schoolName,
        district: ele.district,
        taluka: ele.taluka,
        village: ele.village,
      }
      this.resultDownloadArr.push(obj);
    });
    // download pdf call
    if (this.resultDownloadArr.length > 0) {
      let keyPDFHeader = ["Sr.No.", "School Name", "District", "Taluka", "Village"];
      let ValueData =
        this.resultDownloadArr.reduce(
          (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)], []
        );
      let objData: any = {
        'topHedingName': 'School Registration Data',
        'createdDate':'Created on:'+this.datepipe.transform(new Date(), 'yyyy-MM-dd, h:mm a')
      }
      ValueData.length > 0 ? this.downloadFileService.downLoadPdf(keyPDFHeader, ValueData, objData):''
    }
   }
  //#endregion ---------------------------------------------- PDF Download end here ----------------------------------------// 

 
  //#region ---------------------------------------------- School Registration Dropdown start here ----------------------------------------// 
  getDistrict() {
    this.masterService.getAllDistrict('').subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.districtArr = res.responseData;
          this.districtId.setValue(this.districtArr[0].id); 
          this.getTaluka();
        }
      },
      error: ((err: any) => { this.commonMethodS.checkEmptyData(err.statusText) == false ? this.errors.handelError(err.statusCode) : this.commonMethodS.showPopup(err.statusText, 1); })
    });
  }

  getTaluka() {
    this.masterService.getAllTaluka(this.webStorageS.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.talukaArr = res.responseData;
          // this.villageId.setValue(0);
        }
      },
      error: ((err: any) => { this.commonMethodS.checkEmptyData(err.statusText) == false ? this.errors.handelError(err.statusCode) : this.commonMethodS.showPopup(err.statusText, 1); })
    });
  }

  getVillage() {
    let talukaId = this.talukaId.value;
    this.masterService.getAllVillage('', talukaId).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.villageArr = res.responseData;
           let obj ={id:0 , village:'All Villages',m_Village: 'सर्व गाव'}
           this.villageArr.unshift(obj) 
       
          console.log("Village : ",this.villageArr);
          
        }
      },
      error: ((err: any) => { this.commonMethodS.checkEmptyData(err.statusText) == false ? this.errors.handelError(err.statusCode) : this.commonMethodS.showPopup(err.statusText, 1); })
    });
  }
  //#endregion ------------------------------------------- School Registration Dropdown start here ----------------------------------------// 

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit':
        this.addUpdateSchool(obj);
        break;
      case 'Delete':
        this.globalDialogOpen(obj);
        break;
      case 'View':
        this.openDetailsDialog(obj);
        break;
    }
  }

  childGridInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit':
        this.addUpdateSchool(obj);
        break;
      case 'Delete':
        this.globalDialogOpen(obj);
        break;
      case 'View':
        this.openDetailsDialog(obj);
        break;
    }
  }
  //#region ------------------------------------------- Open Dialog Box Function start here ----------------------------------------// 
  addUpdateSchool(obj?: any) {
    const dialogRef = this.dialog.open(AddUpdateSchoolRegistrationComponent, {
      width: '820px',
      data: obj,
      disableClose: true,
      // autoFocus: false
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'yes' && obj) {
        this.onClear();
        this.getDistrict();
        this.getTableData();
        this.pageNumber = this.pageNumber;
      }
      else if (result == 'yes') {
        this.getDistrict();
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

  openDetailsDialog(obj:any){
    var data = {
      headerImage: obj.uploadImage,
      header: this.webStorageS.languageFlag == 'EN' ? obj.schoolName : obj.m_SchoolName,
      subheader : this.webStorageS.languageFlag == 'EN' ? obj.schoolType : obj.m_SchoolType,
      labelHeader: this.webStorageS.languageFlag == 'EN' ? ['District', 'Taluka', 'Kendra Name', 'Village', 'Lowest Class', 'Highest Class', 'Total Students'] : ['जिल्हा', 'तालुका', 'केंद्राचे नाव', 'गाव', 'सुरुवातीचा वर्ग ', 'शेवटचा वर्ग', 'एकूण विद्यार्थी'],
      labelKey: this.webStorageS.languageFlag == 'EN' ? ['district', 'taluka', 'center', 'village', 'lowestClass','highestClass','studentCount'] : ['m_District', 'm_Taluka', 'm_Center', 'm_Village', 'lowestClass', 'highestClass','studentCount'],
      Obj: obj,
      chart: false,
      multipleImage: true
    }
    const viewDialogRef = this.dialog.open(GlobalDetailComponent, {
      width: '900px',
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
  //#endregion ------------------------------------------- Open Dialog Box Function end here ----------------------------------------// 

  onClear() {
    if (this.districtId.value || this.talukaId.value || this.villageId.value) {
      // this.districtId.reset();
      this.talukaId.setValue(0);
      // this.talukaId.reset();
      this.villageId.setValue(0);
      // this.villageId.reset();
      // this.talukaArr = [];
      // this.villageArr = [];
      this.getTableData();
      this.pageNumber = 1;
    }
  }

  //#region ---------------------------------------------- Delete Record Logic start here ----------------------------------------//  
  onClickDelete() {
    let webStorageMethod = this.webStorageS.createdByProps();
    let deleteObj = {
      "id": this.deleteObj.id,
      "modifiedBy": webStorageMethod.modifiedBy,
      "modifiedDate": webStorageMethod.modifiedDate,
      "lan": this.webStorageS.languageFlag
    }
    this.apiService.setHttp('delete', 'ZP-Osmanabad/School/Delete', false, deleteObj, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.commonMethodS.showPopup(res.statusMessage, 0);
          this.getTableData();
        }
      }
    })
    error: (error: any) => {
      this.commonMethodS.checkEmptyData(error.statusText) == false ? this.errors.handelError(error.statusCode) : this.commonMethodS.showPopup(error.statusText, 1);
    }
  }
  //#endregion ---------------------------------------------- Delete Record Logic end here ----------------------------------------//  

  selectGrid(label: string) {
    if (label == 'Table') {
      this.cardViewFlag = false;
      this.pageNumber = 1;
      this.getTableData();
    } else if (label == 'Card')
      this.cardViewFlag = true;
    this.getTableData();
  }

  clearDropdown(dropdown: string) {
    if (dropdown == 'Taluka') {
      this.villageId.setValue(0);
      // this.villageId.reset();
      this.villageArr = [];
    }
  }

 }
