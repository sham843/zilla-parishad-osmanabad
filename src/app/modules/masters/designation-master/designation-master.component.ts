import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
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
  designationArray:any;
  DesiganationTypeArray:any;
  deleteObj:any;

  constructor(private dialog: MatDialog, private apiService: ApiService, private errors: ErrorsService,
    private masterService:MasterService ,private commonMethod: CommonMethodsService,
    private errorHandler: ErrorsService) { }

  ngOnInit() {
    this.getTableData()
    this.getDesignationData();
    
  }
//#region ------------------------------------- Designation-Master Dropdown ------------------------------- //
getDesignationData(){
  this.masterService.GetAllDesignationLevel('EN').subscribe({
    next: ((res: any) => {
      if (res.statusCode == '200' && res.responseData.length) {
        this.designationArray= res.responseData;          
        this.getDesiganationType();             
      }
    })       
  })
}

getDesiganationType() {  
let desigLevelId = this.designationArray?.find((res:any)=>{
    return res;    
  })
  this.masterService.GetDesignationByLevelId('EN', desigLevelId.id).subscribe({
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

  //#region ------------------------------------- Designation-Master Table-Data ------------------------------- //
  getTableData(flag?:string) {
    this.pageNumber =   flag == 'filter'? 1 :this.pageNumber;
    let tableDataArray = new Array();
    let tableDatasize!: Number; 
    let str = `Id=${this.searchContent.value?this.searchContent.value:0}&pageno=${this.pageNumber}&pagesize=10&lan=EN`;
    this.apiService.setHttp('GET', 'zp_osmanabad/designation-master/GetAll?' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({

      next: (res: any) => {
        if (res.statusCode == "200") {
          tableDataArray = res.responseData.responseData1;
          tableDatasize = res.responseData.responseData2.pageCount;
        } else {
          tableDataArray = [];
          tableDatasize = 0;
        }
        let displayedColumns = ['srNo', 'designationName', 'designationLevel', 'action'];
        let displayedheaders = ['Sr. No', 'Designation Name', 'Designation Level','action'];
        let tableData = {
          pageNumber: this.pageNumber,
          img: '', blink: '', badge: '', isBlock: '', pagintion:true,
          displayedColumns: displayedColumns, tableData: tableDataArray,
          tableSize: tableDatasize,
          tableHeaders: displayedheaders
        };
        this.apiService.tableData.next(tableData);
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

  //#region -------------------------------------------dialog box open function's start heare----------------------------------------//
  addUpdateAgency(obj?: any) {   
    
    const dialogRef = this.dialog.open(AddUpdateDesignationMasterComponent, {
      width: '420px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })  
     dialogRef.afterClosed().subscribe((result: any) => {
     
      if(result == 'Yes'){       
        this.getTableData();
      }     
    });
  }

  globalDialogOpen(obj:any) {
    this.deleteObj = obj;
    let dialoObj = {
      header: 'Delete',
      title: 'Do You Want To Delete The Selected Content ?',
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
     
      if(result == 'yes'){
       
        this.onClickDelete();
      }
  })
}
  //#endregion -------------------------------------------dialog box open function's end heare----------------------------------------//

  onClickDelete(){   
     let deleteObj=  [{
      "id": this.deleteObj.id,
      "deletedBy": 0,
      "modifiedDate": new Date(),
      "lan": "EN"
    }]

    this.apiService.setHttp('delete', 'zp_osmanabad/designation-master/Delete', false, deleteObj, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.commonMethod.snackBar(res.statusMessage, 0);
          // this.clearForm();
          this.getTableData();
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  downloadPdf(){

  }

  clearForm(){
    this.searchContent.reset();
    this.getTableData();
  }
}
