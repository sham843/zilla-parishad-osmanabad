import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
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
  id:any;
  designationArray:any;

  constructor(private dialog: MatDialog, private apiService: ApiService, private errors: ErrorsService,
    private masterService:MasterService) { }

  ngOnInit() {
    this.getTableData()
    this.getDesignationData();
  }

getDesignationData(){
  this.masterService.GetAllDesignationLevel('EN').subscribe({
    next: ((res: any) => {
      if (res.statusCode == '200' && res.responseData.length) {
        this.designationArray= res.responseData;
        console.log("this.designationArray",res.responseData);               
      }
    })             
    
  })
}
  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData()
  }

  getTableData(flag?:string) {
    this.pageNumber =   flag == 'filter'? 1 :this.pageNumber;
    let tableDataArray = new Array();
    let tableDatasize!: Number;
  // zp_osmanabad/designation-master/GetAll?pageno=1&pagesize=10&lan=EN
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

  childCompInfo(obj: any) {     
   
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;       
        this.getTableData();
        break;
      case 'Edit' || 'Delete':        
        this.addUpdateAgency(obj);       
        break;
      case 'Block':
        this.globalDialogOpen();
        break;
    }
  }

  //#region -------------------------------------------dialog box open function's start heare----------------------------------------//
  addUpdateAgency(obj?: any) {   
    debugger;
    const dialogRef= this.dialog.open(AddUpdateDesignationMasterComponent, {
      width: '420px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })  
     dialogRef.afterClosed().subscribe((result: any) => {
     
      if(result == 'Yes'){
       
        this.getTableData();
      }
      // else if(result == 'Yes'){
      //   this.currentPage =0;
      //   this.getTableData();
      // }  

    });
  }

  globalDialogOpen() {
    this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: '',
      disableClose: true,
      autoFocus: false
    })
  }
  //#endregion -------------------------------------------dialog box open function's end heare----------------------------------------//
}
