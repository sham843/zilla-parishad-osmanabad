import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { AddUpdateOfficeUsersComponent } from './add-update-office-users/add-update-office-users.component';

@Component({
  selector: 'app-office-users',
  templateUrl: './office-users.component.html',
  styleUrls: ['./office-users.component.scss']
})
export class OfficeUsersComponent {

  pageNumber: number = 1;
  searchContent = new FormControl('');

  constructor(private apiService: ApiService, private errors: ErrorsService, private dialog: MatDialog) { }

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

    let str = `?pageno=${this.pageNumber}&pagesize=10&TextSearch=`;
    this.apiService.setHttp('GET', 'zp_osmanabad/Office/GetAllOffice' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({

      next: (res: any) => {
        if (res.statusCode == "200") {
          tableDataArray = res.responseData.responseData1;
          tableDatasize = res.responseData.responseData2.pageCount;
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
      error: ((err: any) => { this.errors.handelError(err) })
    });

  }

  addUpdateAgency() {
    let obj: any;
    this.dialog.open(AddUpdateOfficeUsersComponent, {
      width: '900px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit' || 'Delete':
        // this.addUpdateAgency(obj);
        break;    
    }
  }


}