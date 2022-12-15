import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { AddUpdateDesignationMasterComponent } from './add-update-designation-master/add-update-designation-master.component';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-designation-master',
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.scss']
})
export class DesignationMasterComponent {


  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];


  
  pageNumber: number = 1;
  searchContent = new FormControl('');
  

  constructor(private dialog: MatDialog, private apiService: ApiService, private errors: ErrorsService) { }

  ngOnInit() {
    this.getTableData()
  }


  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData()
  }

  getTableData(flag?:string) {
    this.pageNumber =   flag == 'filter'? 1 :this.pageNumber;
    let tableDataArray = new Array();
    let tableDatasize!: Number;
    let str = `Id=1&pageno=${this.pageNumber}&pagesize=10`;
    this.apiService.setHttp('GET', 'zp_osmanabad/designation-master/GetAllDesignationById?' + str, false, false, false, 'baseUrl');
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
    this.dialog.open(AddUpdateDesignationMasterComponent, {
      width: '420px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
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
