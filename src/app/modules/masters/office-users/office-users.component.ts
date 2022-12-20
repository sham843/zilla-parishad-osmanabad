import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { AddUpdateOfficeUsersComponent } from './add-update-office-users/add-update-office-users.component';

@Component({
  selector: 'app-office-users',
  templateUrl: './office-users.component.html',
  styleUrls: ['./office-users.component.scss']
})
export class OfficeUsersComponent {

  pageNumber: number = 1;
  searchContent = new FormControl('');

  constructor(private apiService: ApiService, private errors: ErrorsService, private dialog: MatDialog, private commonService: CommonMethodsService) { }

  ngOnInit() {
    this.getTableData()
  }

  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData()
  }

  getTableData(flag?: string) {
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    let tableDataArray = new Array();
    let tableDatasize!: Number;
    let str = `?textSearch=${this.searchContent.value}&pageno=${this.pageNumber}&pagesize=10&lan=mr-IN`;
    this.apiService.setHttp('GET', 'zp_osmanabad/Office/GetAllOffice' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          tableDataArray = res.responseData.responseData1;
          tableDatasize = res.responseData.responseData2.pageCount;
          this.commonService.snackBar(res.statusMessage, 0);
        } else {
          tableDataArray = [];
          tableDatasize = 0;
        }
        let displayedColumns = ['srNo', 'name', 'designationId', 'mobileNo', 'emailId', 'm_Name', 'action'];
        let displayedheaders = ['Sr. No', 'Name', 'Designation', 'Contact No', 'Email ID', 'Office Name', 'action'];
        let tableData = {
          pageNumber: this.pageNumber,
          img: '', blink: '', badge: '', isBlock: '', pagintion: true,
          displayedColumns: displayedColumns, tableData: tableDataArray,
          tableSize: tableDatasize,
          tableHeaders: displayedheaders
        };
        this.apiService.tableData.next(tableData);
      },
      error: ((err: any) => { this.errors.handelError(err.message) })
    });
  }

  addUpdateOffice(obj?: any) {
    const dialogRef = this.dialog.open(AddUpdateOfficeUsersComponent, {
      width: '900px',
      height: '300px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(result => {
      result == 'Yes' ? this.getTableData() : '';
    });
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit':
        this.addUpdateOffice(obj);
        break; 
      case 'Delete':
        this.globalDialogOpen(obj);
          break;    
    }
  }

  globalDialogOpen(obj:any) {
    let dialoObj = {
      header: 'Delete',
      title: 'Do You Want To Delete ?',
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
        console.log("click yes");
        this.deleteOffice(obj);
      }
      if(result == 'No'){
        console.log("click no");
      }
  })
}

deleteOffice(obj: any){
 let deleteObj = {
    "id": obj.id,
    "deletedBy": 1,
    "modifiedDate": new Date(),
    "lan": "mr-IN"
  }
  this.apiService.setHttp('DELETE', 'zp_osmanabad/Office/DeleteOffice', false, deleteObj, false, 'baseUrl');
  this.apiService.getHttp().subscribe({
    next: (resp: any)=>{
      console.log(resp); 
    }
  })
}


clearFilterData(){
    this.searchContent.setValue('');
    this.getTableData();
  }


}