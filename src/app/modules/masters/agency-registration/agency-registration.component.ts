import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
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
    private errors: ErrorsService, private fb: FormBuilder) { }

  ngOnInit() {
    this.filterData();
    this.getTableData();
  }

  filterData() {
    this.filterForm = this.fb.group({
      name: '',
      contactNo: '',
      email: ''
    })
  }

  getTableData(flag?: string) {
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    let tableDataArray = new Array();
    let tableDatasize!: Number;
    let obj = this.filterForm.value;
    let str = `pageno=${this.pageNumber}&pagesize=10&Agency_Name=${obj.name}&Contact_No=${obj.contactNo}&EmailId=${obj.email}`;
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
        let displayedColumns = ['srNo', 'agency_Name', 'contact_No', 'emailId', 'action'];
        let displayedheaders = ['Sr.No', 'Name', 'Contact No.', 'Email ID', 'Action'];
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
    this.getTableData();
  }

  childCompInfo(_obj: any) {
    switch (_obj.label) {
      case 'Pagination':
        this.pageNumber = _obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit' || 'Delete':
        this.addUpdateAgency(_obj);
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
}

