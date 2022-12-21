import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { AddUpdateStudentRegistrationComponent } from './add-update-student-registration/add-update-student-registration.component';
@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.scss']
})
export class StudentRegistrationComponent {
  pageNumber: number = 1;
  searchContent = new FormControl('');
  tableDataForcard: any;
  cardViewFlag: boolean = false;

  constructor(private dialog: MatDialog, private apiService: ApiService, private errors: ErrorsService) { }

  ngOnInit() {
    this.getTableData();
  }

  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData()
  }

  getTableData(flag?: string) {
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    let tableDataArray = new Array();
    let tableDatasize!: Number;

    let str = `?pageno=${this.pageNumber}&pagesize=10&textSearch=${this.searchContent.value || ''}`;
    this.apiService.setHttp('GET', 'zp-osmanabad/Student/GetAll' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({

      next: (res: any) => {
        if (res.statusCode == "200") {
          tableDataArray = res.responseData.responseData1;
          tableDatasize = res.responseData.responseData2.pageCount;
        } else {
          tableDataArray = [];
          tableDatasize = 0;
        }
        let displayedColumns = ['docPath', 'srNo', 'fullName', 'standard', 'parentMobileNo', 'gender', 'action'];
        let displayedheaders = ['#', 'Sr. No', 'Name', 'Standard', 'Parents Contact No.', 'Gender', 'action'];
        let tableData = {
          pageNumber: this.pageNumber,
          img: 'docPath', blink: '', badge: '', isBlock: '', pagintion: true,
          displayedColumns: displayedColumns, tableData: tableDataArray,
          tableSize: tableDatasize,
          tableHeaders: displayedheaders
        };

        this.tableDataForcard = {
          pageNumber: this.pageNumber,
          tableData: tableDataArray,
          tableSize: tableDatasize,
        };
        this.apiService.tableData.next(tableData);

      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  addUpdateAgency(obj?:any) {    
    this.dialog.open(AddUpdateStudentRegistrationComponent, {
      width: '900px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }

  childTableCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit' || 'Delete':
        this.addUpdateAgency(obj);
        break;
    }
  }

  childGridCompInfo(obj: any) {
    if (obj.label = 'Pagination') {
      this.pageNumber = obj.pageNumber;
      this.getTableData();
    }

  }

  selectGrid(label: string) {
    if (label == 'Table') {
      this.cardViewFlag = false;
      this.getTableData()
    } else if (label == 'Card')
      this.cardViewFlag = true;
  }

  clearForm(){
    this.searchContent.setValue('');
    this.getTableData();
  }
}
