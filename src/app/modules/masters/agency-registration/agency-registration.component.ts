import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { AddUpdateAgencyRegistrationComponent } from './add-update-agency-registration/add-update-agency-registration.component';

@Component({
  selector: 'app-agency-registration',
  templateUrl: './agency-registration.component.html',
  styleUrls: ['./agency-registration.component.scss']
})
export class AgencyRegistrationComponent {
  pageNumber: number = 1;
  filterForm!: FormGroup;
  constructor(private dialog: MatDialog, private apiService: ApiService,
    private errors: ErrorsService, private fb: FormBuilder, private common : CommonMethodsService) { }

  ngOnInit() {
    this.filterData();
    this.getTableData();
  }

  filterData() {
    this.filterForm = this.fb.group({
      searchText: '',
    })
  }

  getTableData(flag?: string) {
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    let tableDataArray = new Array();
    let tableDatasize!: Number;
    let obj = this.filterForm.value;
    let str = `pageno=${this.pageNumber}&pagesize=10&&TextSearch=${obj.searchText}`;
    this.apiService.setHttp('GET', 'zp-osmanabad/Agency/GetAll?' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          tableDataArray = res.responseData.responseData1;
          tableDatasize = res.responseData.responseData2.pageCount;
        } else {
          tableDataArray = [];
          tableDatasize = 0;
        }
        let displayedColumns = ['srNo', 'agency_Name', 'contact_No', 'agency_EmailId', 'action'];
        let displayedheaders = ['Sr. No.', 'Name', 'Contact No.', 'Email ID', 'Action'];
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

  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData()
  }

  onClear() {
    this.filterForm.reset();
    this.filterData();
    this.pageNumber = 1;
    this.getTableData();
  }

  childCompInfo(_obj: any) {
    switch (_obj.label) {
      case 'Pagination':
        this.pageNumber = _obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit':
        this.addUpdateAgency(_obj);
        break;
        case 'Delete' :
        this.deleteAgency(_obj);
        break;
      case 'Block':
        // this.globalDialogOpen();
        break;
    }
  }

  addUpdateAgency(_obj?: any) {
    const dialogRef = this.dialog.open(AddUpdateAgencyRegistrationComponent, {
      width: '900px',
      data: _obj,
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      result == 'Yes' ? this.getTableData() : '';
    });
  }

  deleteAgencyRow(_obj:any){
    let obj = {
      "id": _obj.id,
      "modifiedBy": 0,
      "modifiedDate": new Date(),
      "lan": ""
    }
   
    this.apiService.setHttp('delete', 'zp-osmanabad/Agency/Delete', false, obj, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        res.statusCode == 200 ? this.common.snackBar(res.statusMessage, 0): this.common.snackBar(res.statusMessage, 1);
      },
      error: ((err: any) => { this.errors.handelError(err) })
    })
  }

  deleteAgency(_obj:any){
    let dialoObj = {
      header: 'Delete',
      title: 'Do You Want To Delete The Selected Agency ?',
      cancelButton: 'Cancel',
      okButton: 'Ok'
    }
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      result == 'yes' ? (this.deleteAgencyRow(_obj),this.getTableData() ): '';
    });
  }
}

