import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AddUpdateDesignationMasterComponent } from './add-update-designation-master/add-update-designation-master.component';
import { DesignationMasterService } from './designation-master.service';

@Component({
  selector: 'app-designation-master',
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.scss']
})
export class DesignationMasterComponent {
  array: any;
  displayedColumns = new Array();
  displayedheaders = new Array();
  tableData: any;
  tableDataArray: any;
  tableDatasixze!: number;
  pageNumber: number = 0;
  searchContent = new FormControl('');
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog, private designationService: DesignationMasterService) { }
  
  ngOnInit() {
    this.getTableData()
  }
  ngAfterViewInit() {
    this.searchContent.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.getTableData()
    });
  }
  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData()
  }
  getTableData() {
    this.searchContent.value ? this.pageNumber = 0 : this.pageNumber;
    this.designationService.getDesignation(this.pageNumber, this.searchContent.value).subscribe((res: any) => {

      if (res.statusCode == "200") {
        res.responseData.responseData1.map((x: any) => {
          x.isBlock = x.isBlock == 1 ? true : false;
        })
        this.tableDataArray = res.responseData.responseData1;
        this.tableDatasixze = res.responseData.responseData2.totalRecords;
      } else {
        this.tableDataArray = [];
      }
      this.displayedColumns = ['srno', 'name', 'mobileNo1', 'roleName', 'isBlock', 'action'];
      this.displayedheaders = ['Sr. No', 'Name', 'Mobile No', 'role Name', 'isBlock', 'action'];
      this.tableData = { srno: 'srno', img: 'img', blink: '', badge: '', isBlock: 'isBlock', displayedColumns: this.displayedColumns, tableData: this.tableDataArray, tableSize: this.tableDatasixze, tableHeaders: this.displayedheaders };

      this.designationService.tableData.next(this.tableData);

    })
  }

  addUpdateAgency(obj?: any) {
    this.dialog.open(AddUpdateDesignationMasterComponent, {
      width: '320px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }

  childCompInfo(obj: any) {
    obj.label == 'Edit' ? this.addUpdateAgency(obj) : '';
  }
  openConfirmation(selectedObj?: any) {
    console.log(selectedObj)
    // this.dialog.open(AddUpdateDesignationMasterComponent, {
    //   width: '320px',
    //   data: selectedObj,
    //   disableClose: true,
    //   autoFocus: false
    // })
  }
}
