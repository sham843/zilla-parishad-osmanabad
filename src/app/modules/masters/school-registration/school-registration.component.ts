import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { AddUpdateSchoolRegistrationComponent } from './add-update-school-registration/add-update-school-registration.component';

@Component({
  selector: 'app-school-registration',
  templateUrl: './school-registration.component.html',
  styleUrls: ['./school-registration.component.scss']
})
export class SchoolRegistrationComponent {
  pageNumber: number = 1;
  searchContent = new FormControl('');
  
  constructor(private dialog : MatDialog, private apiService : ApiService, private errors : ErrorsService, ) { }

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

    let str = `?pageno=${this.pageNumber}&pagesize=10&DistrictId=1&TalukaId=1&VillageId=1`;
    this.apiService.setHttp('GET', 'ZP-Osmanabad/School/GetAllSchoolByPagination' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({

      next: (res: any) => {
        if (res.statusCode == "200") {
          tableDataArray = res.responseData.responseData1;
          tableDatasize = res.responseData.responseData2.pageCount;
        } else {
          tableDataArray = [];
          tableDatasize = 0;
        }
        let displayedColumns = ['srNo', 'schoolName', 'village', 'taluka', 'district', 'action'];
        let displayedheaders = ['Sr. No', 'Name', 'Village', 'Taluka', 'District', 'action'];
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

  childCompInfo(_obj: any) {
    // switch (obj.label) {
    //   case 'Pagination':
    //     this.pageNumber = obj.pageNumber;
    //     this.getTableData();
    //     break;
    //   case 'Edit' || 'Delete':
    //     this.addUpdateAgency(obj);
    //     break;
    //   case 'Block':
    //     this.globalDialogOpen();
    //     break;
    // }
  }

  addUpdateAgency() {
    let obj: any;
    this.dialog.open(AddUpdateSchoolRegistrationComponent, {
      width:'820px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }

}
