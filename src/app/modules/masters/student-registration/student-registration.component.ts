import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { AddUpdateStudentRegistrationComponent } from './add-update-student-registration/add-update-student-registration.component';
@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.scss']
})
export class StudentRegistrationComponent {
  pageNumber: number = 1;
  searchContent = new FormControl('');
  tableDataArray = new Array();
  tableDataForcard: any;
  cardViewFlag: boolean = false;
  totalCount: number = 0;
  cardCurrentPage: number = 0;

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private errors: ErrorsService,
    private commonMethods: CommonMethodsService) { }

  ngOnInit() {
    this.getTableData();
  }

  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData()
  }

  getTableData(flag?: string) {
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    this.tableDataArray = new Array();
    let tableDatasize!: Number;

    let pageNo = this.cardViewFlag ? (this.cardCurrentPage + 1) : this.pageNumber;
    let str = `?pageno=${pageNo}&pagesize=10&textSearch=${this.searchContent.value || ''}`;
    this.apiService.setHttp('GET', 'zp-osmanabad/Student/GetAll' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({

      next: (res: any) => {
        if (res.statusCode == "200") {
          this.tableDataArray = res.responseData.responseData1;
          this.totalCount = res.responseData.responseData2.pageCount;
          tableDatasize = res.responseData.responseData2.pageCount;

        } else {
          this.tableDataArray = [];
          tableDatasize = 0;
        }
        let displayedColumns = ['docPath', 'srNo', 'fullName', 'standard', 'parentMobileNo', 'gender', 'action'];
        let displayedheaders = ['#', 'Sr. No', 'Name', 'Standard', 'Parents Contact No.', 'Gender', 'action'];
        let tableData = {
          pageNumber: this.pageNumber,
          img: 'docPath', blink: '', badge: '', isBlock: '', pagintion: tableDatasize > 10 ? true : false,
          displayedColumns: displayedColumns, tableData: this.tableDataArray,
          tableSize: tableDatasize,
          tableHeaders: displayedheaders
        };

        this.tableDataForcard = {
          pageNumber: this.pageNumber,
          tableData: this.tableDataArray,
          tableSize: tableDatasize,
        };
        this.apiService.tableData.next(tableData);

      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  addUpdateAgency(obj?: any) {
    const dialogRef = this.dialog.open(AddUpdateStudentRegistrationComponent, {
      width: '900px',
      data: obj,
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);

      if (result == 'yes') {
        this.getTableData();
      }
    });
  }

  deteleDialogOpen(obj: any) {
    let dialoObj = {
      header: 'Delete',
      title: 'Do you want to delete Student record?',
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
        this.deleteRecord(obj.id)
      }
    })
  }

  deleteRecord(id: any) {
    let deleteObj = {
      "id": id,
      "modifiedBy": 0,
      "modifiedDate": "2022-12-21T12:30:51.962Z",
      "lan": "string"
    }
    this.apiService.setHttp('delete', 'zp-osmanabad/Student/DeleteStudent', false, deleteObj, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.commonMethods.snackBar(res.statusMessage,0);
          this.getTableData()
        } else {
          this.commonMethods.snackBar(res.statusMessage,1);
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });

  }

  childTableCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit':
        this.addUpdateAgency(obj);
        break;
      case 'Delete':
        this.deteleDialogOpen(obj);
        break;
    }
  }

  childGridCompInfo(obj: any) {
    if (obj.label = 'Pagination') {
      this.pageNumber = obj.pageNumber;
      this.getTableData();
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
      this.getTableData()
    } else if (label == 'Card')
      this.cardViewFlag = true;
    this.cardCurrentPage = 0;
    this.getTableData();
  }

  clearForm() {
    this.searchContent.setValue('');
    this.getTableData();
  }
}
