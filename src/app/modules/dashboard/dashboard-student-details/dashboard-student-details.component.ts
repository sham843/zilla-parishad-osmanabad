import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
@Component({
  selector: 'app-dashboard-student-details',
  templateUrl: './dashboard-student-details.component.html',
  styleUrls: ['./dashboard-student-details.component.scss']
})
export class DashboardStudentDetailsComponent {
  pageNumber: number = 1;
  tableDataArray = new Array();
  totalCount!: number;
  tableDatasize!: Number;
  languageFlag!: string;
  editStudentId: any;
  data: any;
  searchContent = new FormControl('');

  talukaArr:any = []
  centerArr:any = []
  schoolArr :any= []

  displayedColumns = ['docPath', 'srNo', 'fullName', 'Status'];
  marathiDisplayedColumns = ['docPath', 'srNo', 'm_FullName', 'Status'];
  displayedheaders = ['#', 'Sr. No.', 'Name', 'Status'];
  marathiDisplayedheaders = ['#', 'अनुक्रमांक', 'नाव', 'Status'];

  filterForm!: FormGroup

  constructor(
    private fb: FormBuilder,
    private ngxSpinner: NgxSpinnerService,
    private apiService: ApiService,
    private webService: WebStorageService,
    private errors: ErrorsService,
    private route: ActivatedRoute,
    public validators: ValidationService,
    public translate: TranslateService,
    private commonMethods: CommonMethodsService,
    private masterService: MasterService,
  ) { }
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.editStudentId = params.get('id');
    })
    this.formData();
    this.languageChange();
    this.getTaluka();
    this.getTableData();
  }

  formData() {
    this.filterForm = this.fb.group({
      talukaId :[''],
       centerId:[''],
       schoolId:[''],
    })
  }

  languageChange() {
    this.webService.langNameOnChange.subscribe(lang => {
      this.languageFlag = lang;
      this.setTableData();
    });

  }

  setTableData() {
    let tableData = {
      pageNumber: this.pageNumber,
      img: 'docPath', blink: '', badge: '', isBlock: '', pagintion: true,
      displayedColumns: this.languageFlag == 'English' ? this.displayedColumns : this.marathiDisplayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.totalCount,
      tableHeaders: this.languageFlag == 'English' ? this.displayedheaders : this.marathiDisplayedheaders
    };
    this.apiService.tableData.next(tableData);
  }


  getTableData(flag?: any) {
    this.ngxSpinner.show();
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber
    // ?pageno=1&pagesize=10&textSearch=p&TalukaId=1&CenterId=1&SchoolId=1&lan=1'
    let str = `?pageno=${this.pageNumber}&pagesize=10&textSearch=&TalukaId=${this.filterForm.value.talukaId || 0}&CenterId=${this.filterForm.value.centerId || 0}&SchoolId=${this.filterForm.value.schoolId || 0}&lan=${this.languageFlag || ''}`;

    this.apiService.setHttp('GET', 'zp-osmanabad/Student/GetAll' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.ngxSpinner.hide();
          this.tableDataArray = res.responseData.responseData1;
          this.totalCount = res.responseData.responseData2.pageCount;
          this.tableDataArray.map((res: any) => {
            res.docPath = res.documentResponse[0]?.docPath
          })
          let obj = this.tableDataArray[0];
          this.data = {
            headerImage: obj.documentResponse[0].docPath,
            header: this.webService.languageFlag == 'EN' ? obj.fullName : obj.m_FullName,
            subheader: this.webService.languageFlag == 'EN' ? obj.gender : obj.m_Gender,
            labelHeader: this.webService.languageFlag == 'EN' ? ['Father Name', 'Parent Mobile No.', 'Aadhar No.', 'Standard', 'School Name'] : ['वडीलांचे नावं', 'पालक मोबाईल क्र.', 'आधार क्र.', 'इयत्ता', 'शाळेचे नाव'],
            labelKey: this.webService.languageFlag == 'EN' ? ['fatherFullName', 'parentMobileNo', 'aadharNo', 'standard', 'schoolName'] : ['m_FatherFullName', 'parentMobileNo', 'aadharNo', 'standard', 'm_SchoolName'],
            Obj: obj,
            chart: false
          }


        } else {
          this.ngxSpinner.hide();
          this.tableDataArray = [];
          this.totalCount = 0;
          this.data =''
        }
        this.setTableData();

      },
      error: ((err: any) => { this.ngxSpinner.hide(); this.errors.handelError(err) })
    });
  }

  viewDetails(obj: any) {
    this.data = {
      headerImage: obj.documentResponse[0].docPath,
      header: this.webService.languageFlag == 'EN' ? obj.fullName : obj.m_FullName,
      subheader: this.webService.languageFlag == 'EN' ? obj.gender : obj.m_Gender,
      labelHeader: this.webService.languageFlag == 'EN' ? ['Father Name', 'Parent Mobile No.', 'Aadhar No.', 'Standard', 'School Name'] : ['वडीलांचे नावं', 'पालक मोबाईल क्र.', 'आधार क्र.', 'इयत्ता', 'शाळेचे नाव'],
      labelKey: this.webService.languageFlag == 'EN' ? ['fatherFullName', 'parentMobileNo', 'aadharNo', 'standard', 'schoolName'] : ['m_FatherFullName', 'parentMobileNo', 'aadharNo', 'standard', 'm_SchoolName'],
      Obj: obj,
      chart: false
    }
  }


  getTaluka() {
    this.talukaArr = [];
    this.masterService.getAllTaluka(this.languageFlag).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.talukaArr = res.responseData;
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
          this.talukaArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err.statusCode) })
    });
  }

  getAllCenter() {
    this.centerArr = [];
    let Tid = this.filterForm.value.talukaId
    this.masterService.getAllCenter(this.languageFlag, Tid).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.centerArr = res.responseData;
        } else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
          this.centerArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err.statusCode) })
    });
  }

  getAllSchoolsByCenterId() {
    this.schoolArr = [];
    let Tid = this.filterForm.value.talukaId;
    let Cid = this.filterForm.value.centerId;
    this.masterService.getAllSchoolByCriteria(this.languageFlag, Tid, 0, Cid).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.schoolArr = res.responseData;
        } else {
          // this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.showPopup(res.statusMessage, 1);
          this.schoolArr = [];
        }
      },
      error: ((err: any) => { this.errors.handelError(err.statusCode) })
    });
  }

  

  clearDropdown(name: any) {
    if (name == 'talukaId') {
      this.filterForm.controls['centerId'].setValue('');
      this.filterForm.controls['schoolId'].setValue('');
    } else if (name == 'centerId') {
      this.filterForm.controls['schoolId'].setValue('');
    }
  }

  



  childTableCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit':
        // this.addUpdateAgency(obj);
        break;
      case 'Delete':
        // this.deteleDialogOpen(obj);
        break;
      case 'View':
        this.viewDetails(obj);
        break;
    }
  }

  clearForm() {
    this.filterForm.reset();
    this.getTableData();
  }
}
