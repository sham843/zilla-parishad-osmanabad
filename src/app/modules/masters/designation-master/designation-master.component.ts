import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { DownloadPdfExcelService } from 'src/app/core/services/download-pdf-excel.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { AddUpdateDesignationMasterComponent } from './add-update-designation-master/add-update-designation-master.component';
@Component({
  selector: 'app-designation-master',
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.scss']
})
export class DesignationMasterComponent {
  pageNumber: number = 1;
  searchContent = new FormControl('');  
  DesiganationTypeArray:any;
  resultDownloadArr = new Array();tableData: any;
  tableDataArray = new Array();
  tableDatasize!: Number;
  displayedColumns = new Array();
  displayedheaders = ['Sr.No.', 'Designation', 'Designation Level', 'Action'];
  displayedheadersMarathi = ['अनुक्रमांक', 'पदनाम', 'पदनाम स्तर','कृती',];
  langTypeName: any

  constructor(private dialog: MatDialog, private apiService: ApiService, private errors: ErrorsService,
    private masterService:MasterService ,private commonMethod: CommonMethodsService, public webStorage : WebStorageService,
    private errorHandler: ErrorsService ,private downloadFileService : DownloadPdfExcelService) { }

  ngOnInit() {
    this.getTableData(); 
    this.getDesiganationType();     
    this.getofficeReport()
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

getDesiganationType() {  
  this.masterService.GetDesignationByLevelId(this.webStorage.languageFlag,0).subscribe({
    next: ((res: any) => {
      if (res.statusCode == '200' && res.responseData.length) {
        this.DesiganationTypeArray = res.responseData;              
      }
    })
  }) 
}
//#endregion ------------------------------------ End Designation-Master Dropdown --------------------------//

  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData()
  }

  filterData(){
    if(this.searchContent.value){
      this.getTableData();
      this.pageNumber = 1;
      this.getofficeReport();
      

    }
  }
  //#region ------------------------------------- Designation-Master Table-Data ------------------------------- //
  getTableData(flag?:string) {
    this.tableDataArray = [];
    if(localStorage.getItem('designation')){
      this.pageNumber = JSON.parse(localStorage.getItem('designation')||'');
      localStorage.removeItem('designation');
    }
    this.pageNumber =   flag == 'filter'? 1 :this.pageNumber;
    // let tableDataArray = new Array();
    // let tableDatasize!: Number; 
    let str = `Id=${this.searchContent.value?this.searchContent.value:0}&pageno=${this.pageNumber}&pagesize=10&lan=${this.webStorage.languageFlag}`;
    this.apiService.setHttp('GET', 'zp_osmanabad/designation-master/GetAll?' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({

      next: (res: any) => {
        if (res.statusCode == "200") {
          this.tableDataArray = res.responseData.responseData1;
          this.tableDatasize = res.responseData.responseData2.pageCount;
        } else {
          this.tableDataArray = [];
          this.tableDatasize = 0;
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
        this.pageNumber = this.pageNumber;
        localStorage.setItem('designation',JSON.stringify(this.pageNumber));
      }
      else if(result == 'yes' ){
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
     let deleteObj=  [{
      "id": obj.id,
      "deletedBy": 0,
      "modifiedDate": new Date(),
      "lan": "EN"
    }]

    this.apiService.setHttp('delete', 'zp_osmanabad/designation-master/Delete', false, deleteObj, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.commonMethod.snackBar(res.statusMessage, 0);
          this.clearForm();
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getofficeReport(){
    let str = `Id=${this.searchContent.value?this.searchContent.value:0}&lan=${this.webStorage.languageFlag}`;
    this.apiService.setHttp('GET', 'zp_osmanabad/designation-master/GetAll?' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {          
          let data:[] = res.responseData.responseData1;   
          data.map((ele: any, i: any)=>{
            let obj = {
              "Sr.No": i+1,
              "Designation Name": ele.designationName,
              "Designation Level": ele.designationLevel,
            }
            this.resultDownloadArr.push(obj);
          });
        }
      },
      error: ((err: any) => { this.errors.handelError(err.message) })
    });
  }

  downloadPdf() {
    let keyPDFHeader = ['srNo', 'designationName', 'designationLevel'];
        let ValueData =
          this.resultDownloadArr.reduce(
            (acc: any, obj: any) => [...acc, Object.values(obj).map((value) => value)], []
          );// Value Name
          console.log("ValueData", ValueData);          
          let objData:any = {
            'topHedingName': 'Designation Data',
            'createdDate':'Created on:'+new Date()
          }
         this.downloadFileService.downLoadPdf(keyPDFHeader, ValueData, objData);
  }

  clearForm(){
    this.searchContent.reset();
    this.getTableData();
    this.getDesiganationType();
  }
}
