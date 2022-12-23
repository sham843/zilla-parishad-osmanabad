import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { AddUpdateTeacherRegistrationComponent } from './add-update-teacher-registration/add-update-teacher-registration.component';

@Component({
  selector: 'app-teacher-registration',
  templateUrl: './teacher-registration.component.html',
  styleUrls: ['./teacher-registration.component.scss']
})
export class TeacherRegistrationComponent {
  pageNumber: number = 1;
  searchContent = new FormControl('');
  toggleControl = new FormControl(false);
  @HostBinding('class') className = '';
  constructor(private dialog: MatDialog,private overlay:OverlayContainer,private apiService : ApiService, private errors : ErrorsService,) {
  }

  ngOnInit(): void {
    this.getTableData();
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      const darkClassName = 'darkMode';
      this.className = darkMode ? darkClassName : '';
      if (darkMode) {
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });
}

onPagintion(pageNo: number) {
  this.pageNumber = pageNo;
  this.getTableData()
}

getTableData(flag?: string) {
  this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
  let tableDataArray = new Array();
  let tableDatasize!: Number;
  //zp_osmanabad/Teacher/GetAll?pageno=1&pagesize=10&Name=hh&MobileNo=7777777777&EmailId=rfrf&lan=EN
  let str = `pageno=${this.pageNumber}&pagesize=10&lan=mr-IN`;

  this.apiService.setHttp('GET', 'zp_osmanabad/Teacher/GetAll?' + str, false, false, false, 'baseUrl');
  this.apiService.getHttp().subscribe({

    next: (res: any) => {
      if (res.statusCode == "200") {
        tableDataArray = res.responseData.responseData1;
        tableDatasize = res.responseData.responseData2.pageCount;
      } else {
        tableDataArray = [];
        tableDatasize = 0;
      }
      let displayedColumns = ['srNo', 'name', 'mobileNo', 'emailId',' ', 'taluka', 'action'];
      let displayedheaders = ['Sr.No', 'Name', 'Contact No.', 'Email ID', 'Village', 'Taluka', 'action'];
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
  switch (_obj.label) {
    case 'Pagination':
      this.pageNumber = _obj.pageNumber;
      this.getTableData();
      break;
    case 'Edit' || 'Delete':
      this.addUpdateTeacher(_obj);
      break;
    // case 'Block':
    //   this.globalDialogOpen();
    //   break;
  }
}
  
  addUpdateTeacher(obj?:any) {
    // let obj: any;
    this.dialog.open(AddUpdateTeacherRegistrationComponent, {
      width: '900px',
      height:'700px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }

  onFilterClick(){
    this.getTableData();
  }

  clearFilterData(){
    this.searchContent.setValue('');
    this.getTableData();
  }
}
