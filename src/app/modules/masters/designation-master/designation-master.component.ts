import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { DownloadPdfExcelService } from 'src/app/core/services/download-pdf-excel.service';
import { ErrorsService } from 'src/app/core/services/errors.service';

import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { AddUpdateDesignationMasterComponent } from './add-update-designation-master/add-update-designation-master.component';
@Component({
  selector: 'app-designation-master',
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.scss']
})
export class DesignationMasterComponent implements OnInit {
  pageNumber: number = 1;
  searchContent = new FormControl('');  
  DesiganationTypeArray:any;
  resultDownloadArr = new Array();tableData: any;
  tableDataArray = new Array();
  tableDatasize!: Number;
  displayedColumns = new Array();
  displayedheaders = ['Sr.No.', 'Designation', 'Designation Level', 'Action'];
  displayedheadersMarathi = ['अनुक्रमांक', 'पदनाम', 'पदनाम स्तर','कृती',];
  langTypeName: any;
  totalCount: number = 0;
  constructor(private dialog: MatDialog, private apiService: ApiService, private errors: ErrorsService,
    private commonMethod: CommonMethodsService, public webStorage : WebStorageService,
    private errorHandler: ErrorsService ,private downloadFileService : DownloadPdfExcelService, public datepipe : DatePipe) { }

  ngOnInit() {
    this.getTableData(); 
    this.webStorage.langNameOnChange.subscribe(lang => {
      this.langTypeName = lang;
      this.getTableTranslatedData();
    });
  }
//#region ------------------------------------- Designation-Master Dropdown ------------------------------- //

getTableTranslatedData(){
  this.displayedColumns = ['srNo', this.langTypeName == 'English' ? 'designationName' : 'm_DesignationType', this.langTypeName == 'English' ?'designationLevel':'m_DesignationLevel', 'action'];
    this.tableData = {
      pageNumber: this.pageNumber,
      img: '', blink: '', badge: '', isBlock: '', pagintion: true,
      displayedColumns: this.displayedColumns, tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: this.langTypeName == 'English' ? this.displayedheaders : this.displayedheadersMarathi,
    };
  this.apiService.tableData.next(this.tableData);
}


//#endregion ------------------------------------ End Designation-Master Dropdown --------------------------//

  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData()
  }

  // filterData(){
  //   if(this.searchContent.value){
  //     this.getTableData('filter');
  //     this.pageNumber = 1;
  //   }
  // }
  //#region ------------------------------------- Designation-Master Table-Data ------------------------------- //
  getTableData(flag?:string) {
    // this.tableDataArray = [];
    // if(localStorage.getItem('designation')){
    //   this.pageNumber = JSON.parse(localStorage.getItem('designation')||'');
    //   localStorage.removeItem('designation');
    // }
    // this.pageNumber = flag == 'filter'? 1 :this.pageNumber;
    // this.tableDataArray = [];  
    this.pageNumber =   flag == 'filter'? 1 :this.pageNumber;

    // let tableDataArray = new Array();
    // let tableDatasize!: Number; 
   
    let str = `pageno=${this.pageNumber}&pagesize=10&textSearch=${this.searchContent.value ? this.searchContent.value:''}&lan=${this.webStorage.languageFlag}`;
    let reportStr = `pageno=${this.pageNumber}&pagesize=${this.totalCount* 10}&textSearch=${this.searchContent.value ? this.searchContent.value:''}&lan=${this.webStorage.languageFlag}`;
    this.apiService.setHttp('GET', 'zp_osmanabad/register-designation/GetAllByCriteria?' + (flag == 'pdfFlag' ? reportStr : str), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({

      next: (res: any) => {
        if (res.statusCode == "200") {
          // this.tableDataArray = res.responseData.responseData1;
          flag != 'pdfFlag' ? this.tableDataArray = res.responseData.responseData1 : this.tableDataArray = this.tableDataArray;
          this.tableDatasize = res.responseData.responseData2.pageCount;
          this.totalCount = res.responseData.responseData2.pageCount;
          this.resultDownloadArr = [];
          let data: [] = res.responseData.responseData1;
          flag == 'pdfFlag' ? this.downloadPdf(data) : '';
        } else {
          this.tableDataArray = [];
          this.tableDatasize = 0;
          this.tableDatasize == 0 && flag == 'pdfFlag' ? this.commonMethod.showPopup('No Record Found', 1) : '';
        }
        this.getTableTranslatedData();
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });

  }
  //#endregion -------------------------------------End Designation-Master Table-Data ------------------------------- //
  childCompInfo(obj: any) {        
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;       
        this.getTableData();
        break;
      case 'Edit':        
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

  //#region -------------------------------------------dialog box open function's start heare----------------------------------------//
  addUpdateAgency(obj?: any) {  
    const dialogRef = this.dialog.open(AddUpdateDesignationMasterComponent, {
      width: '420px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })  
     dialogRef.afterClosed().subscribe((result: any) => {
     
      if(result == 'yes' && obj){     
        this.clearForm();
        this.getTableData();
        this.pageNumber = this.pageNumber;
      }
      else if(result == 'yes' ){
        this.getTableData();
        this.clearForm();
        this.pageNumber = 1 ;   
      }    
    });
  }

  globalDialogOpen(obj:any) {
    let dialoObj = {
      header: this.webStorage.languageFlag == 'EN' ? 'Delete' : 'हटवा',
      title: this.webStorage.languageFlag == 'EN' ? 'Do you want to delete Designation record?' : 'तुम्हाला पदनाम रेकॉर्ड हटवायचा आहे का',
      cancelButton: this.webStorage.languageFlag == 'EN' ? 'Cancel' : 'रद्द करा',
      okButton: this.webStorage.languageFlag == 'EN' ? 'Ok' : 'ओके'
    }
    const deleteDialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false
    })
    deleteDialogRef.afterClosed().subscribe((result: any) => {     
      if(result == 'yes'){     
        this.onClickDelete(obj);
      }
  })
}
  //#endregion -------------------------------------------dialog box open function's end heare----------------------------------------//

  onClickDelete(obj:any){   
    let webStorageMethod = this.webStorage.createdByProps();
     let deleteObj=  [{
      "id": obj.id,
      "deletedBy": this.webStorage.getUserId(),
      "modifiedDate": webStorageMethod.modifiedDate,
      "lan": this.webStorage.languageFlag
    }]

    this.apiService.setHttp('delete', 'zp_osmanabad/designation-master/Delete', false, deleteObj, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.commonMethod.showPopup(res.statusMessage, 0);
          this.clearForm();
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.showPopup(error.statusText, 1);
      }
    })
  }

  // getofficeReport(){
  //   let str = `pageno=${this.pageNumber}&pagesize=10&textSearch=${this.searchContent.value ? this.searchContent.value:''}&lan=${this.webStorage.languageFlag}`;
  //   this.apiService.setHttp('GET', 'zp_osmanabad/designation-master/GetAllByCriteria?' + str, false, false, false, 'baseUrl');
  //   // let str = `Id=${this.searchContent.value?this.searchContent.value:0}&lan=${this.webStorage.languageFlag}`;
  //   // this.apiService.setHttp('GET', 'zp_osmanabad/designation-master/GetAll?' + str, false, false, false, 'baseUrl');
  //   this.apiService.getHttp().subscribe({
  //     next: (res: any) => {
  //       if (res.statusCode == "200") {          
  //         let data:[] = res.responseData.responseData1;   

          
  //       }
  //     },
  //     error: ((err: any) => { this.errors.handelError(err.message) })
  //   });
  // }

  downloadPdf(data: any) {
    data.map((ele: any, i: any)=>{
      let obj = {
        "Sr.No": i+1,
        "Designation Name": ele.designationName,
        "Designation Level": ele.designationLevel,
      }
      this.resultDownloadArr.push(obj);
    });
    let keyPDFHeader = ['Sr.No.', 'Designation', 'Designation Level'];
        let ValueData =
          this.resultDownloadArr.reduce(
            (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)], []
          );// Value Name
          console.log("ValueData", ValueData);          
          let objData:any = {
            'topHedingName': 'Designation Data',
            'createdDate':'Created on:'+this.datepipe.transform(new Date(), 'yyyy-MM-dd, h:mm a')
          }
         this.downloadFileService.downLoadPdf(keyPDFHeader, ValueData, objData);
  }

  clearForm() {
    if (this.searchContent.value) {
      this.searchContent.reset();
      this.getTableData();
    }
  }

}
