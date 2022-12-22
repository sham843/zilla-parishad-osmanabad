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
  districtId = new FormControl('0');
  talukaId = new FormControl('');
  villageId = new FormControl();
  resultDownloadArr = new Array();

  districtArr = new Array();
  talukaArr = new Array();
  villageArr = new Array();
  deleteObj: any;
  cardViewFlag : boolean = false;
  imgPath : any;
  totalCount: number = 0;
  cardCurrentPage: number = 0;
  langTypeName : any;
  displayedColumns = new Array();
  tableDatasize!: Number;
  tableData: any;
  displayedheaders = ['#','Sr. No', 'Name', 'Village', 'Taluka', 'District', 'Action'];
  displayedheadersMarathi = ['#','अनुक्रमांक', 'शाळेचे नाव', 'गाव', 'तालुका', 'जिल्हा', 'कृती'];

  constructor(private dialog: MatDialog, private apiService: ApiService, private errors: ErrorsService,
    private masterService: MasterService,private commonMethodS: CommonMethodsService, private webStorageS : WebStorageService, 
    private downloadFileService : DownloadPdfExcelService) { }

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

  getTableData(flag?: string) {
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    let tableDatasize!: Number;
    let pageNo = this.cardViewFlag ? (this.cardCurrentPage + 1)  : this.pageNumber; 
    
    let str = `?pageno=${pageNo}&pagesize=10&DistrictId=${this.districtId.value ? this.districtId.value : 0}
    &TalukaId=${this.talukaId.value ? this.talukaId.value : 0}&VillageId=${this.villageId.value ? this.villageId.value : 0}&lan=${this.webStorageS.languageFlag}`;
    this.apiService.setHttp('GET', 'ZP-Osmanabad/School/GetAll' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({

      next: (res: any) => {
        if (res.statusCode == "200") {
          this.tableDataArray = res.responseData.responseData1;
          this.totalCount = res.responseData.responseData2.totalPages;
          tableDatasize = res.responseData.responseData2.pageCount;
        } else {
          this.tableDataArray = [];
          tableDatasize = 0;
        }
        // let displayedColumns = ['docPath','srNo', 'schoolName', 'village', 'taluka', 'district', 'action'];
        // let displayedheaders = ['#','Sr. No', 'Name', 'Village', 'Taluka', 'District', 'action'];
        let tableData = {
          pageNumber: this.pageNumber,
          img: 'docPath', blink: '', badge: '', isBlock: '', pagintion: true,
          displayedColumns: this.displayedColumns, tableData: this.tableDataArray,
          tableSize: tableDatasize,
          tableHeaders: this.langTypeName == 'English' ? this.displayedheaders : this.displayedheadersMarathi
        };
        this.apiService.tableData.next(tableData);
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  languageChange(){
    this.webStorageS.langNameOnChange.subscribe(lang =>{
      this.langTypeName = lang;
      this.displayedColumns = ['#','Sr. No', this.langTypeName == 'English' ? 'schoolName' : 'm_SchoolName', 'Village', 'Taluka', 'District', 'Action'];
      this.tableData = {
        pageNumber: this.pageNumber,
        img: 'docPath', blink: '', badge: '', isBlock: '', pagintion: true,
        displayedColumns: this.displayedColumns, tableData: this.tableDataArray,
        tableSize: this.tableDatasize,
        tableHeaders: this.langTypeName == 'English' ? this.displayedheaders : this.displayedheadersMarathi
      };
      this.apiService.tableData.next(this.tableData);

    })
  }


  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit' || 'Delete':
        this.addUpdateAgency(obj);
        break;
      // case 'Block':
      //   this.globalDialogOpen();
      //   break;
      case 'Delete':
        this.globalDialogOpen(obj);
        break;
    }
  }

  addUpdateAgency(obj?: any) {
    const dialogRef = this.dialog.open(AddUpdateSchoolRegistrationComponent, {
      width: '820px',
      data: obj,
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result == 'yes'){
        this.getTableData();
      }
    });
  }

  globalDialogOpen(obj: any) {
    this.deleteObj = obj;
    let dialoObj = {
      header: 'Delete',
      title: 'Do you want to delete School record?',
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

      if (result == 'yes') {
        this.onClickDelete();
      }
    })
  }

  onClear(){
    this.districtId.reset();
    this.talukaId.reset();
    this.villageId.reset();
    this.getTableData();
  }

  getDistrict() {
    this.masterService.getAllDistrict(this.webStorageS.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.districtArr = res.responseData;
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getTaluka() {
    this.masterService.getAllTaluka(this.webStorageS.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.talukaArr = res.responseData;
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
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
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  onClickDelete() {
    let deleteObj = {
      "id": this.deleteObj.id,
      "modifiedBy": 0,
      "modifiedDate": new Date(),
      "lan": "EN"
    }
    this.apiService.setHttp('delete','ZP-Osmanabad/School/Delete', false, deleteObj, false, 'baseUrl');
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

  getofficeReport(){
    let str = `?&DistrictId=${this.districtId.value ? this.districtId.value : 0}
     &TalukaId=${this.talukaId.value ? this.talukaId.value : 0}&VillageId=${this.villageId.value ? this.villageId.value : 0}&lan=${this.webStorageS.languageFlag}`;
    this.apiService.setHttp('GET', 'ZP-Osmanabad/School/GetAll' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          let data:[] = res.responseData.responseData1;
          data.map((ele: any, i: any)=>{
            let obj = {
              "Sr.No": i+1,
              "Name": ele.schoolName,
              "District": ele.district,
              "Taluka": ele.taluka,
              "Village": ele.village,
            }
            this.resultDownloadArr.push(obj);
          });
        }
      },
      error: ((err: any) => { this.errors.handelError(err.message) })
    });
  }

  downloadPdf() {
    let keyPDFHeader = ['SrNo', "Name", "District", "Taluka","Village"];
        let ValueData =
          this.resultDownloadArr.reduce(
            (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)], []
          );// Value Name
          console.log("ValueData", ValueData);
          
          let objData:any = {
            'topHedingName': 'School Registration Data',
            'createdDate':'Created on:'+new Date()
          }
        this.downloadFileService.downLoadPdf(keyPDFHeader, ValueData, objData);
  }

 

}
