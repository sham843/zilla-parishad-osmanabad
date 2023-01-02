import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
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
  totalCount!:number;
  tableDatasize!: Number;
  languageFlag!: string;
  editStudentId:any;
  data:any;
  searchContent = new FormControl('');

  displayedColumns = ['docPath', 'srNo', 'fullName', 'Status'];
  marathiDisplayedColumns = ['docPath', 'srNo', 'm_FullName', 'Status' ];
  displayedheaders = ['#', 'Sr. No.', 'Name', 'Status'];
  marathiDisplayedheaders = ['#', 'अनुक्रमांक', 'नाव', 'Status'];

  

  constructor(
    private  ngxSpinner : NgxSpinnerService,
    private apiService: ApiService,
    private webService: WebStorageService,
    private errors: ErrorsService,
    private route: ActivatedRoute,
    public validators: ValidationService,
    public translate: TranslateService
  ){}
  ngOnInit(){
    this.route.paramMap.subscribe((params) => {
      this.editStudentId = params.get('id');
    })
    this.languageChange();
    this.getTableData();
  }

  languageChange() {
    this.webService.langNameOnChange.subscribe(lang => {
      this.languageFlag = lang;  
      this.setTableData();  
    });
    
  }

  setTableData(){
    let tableData = {
      pageNumber: this.pageNumber,
      img: 'docPath', blink: '', badge: '', isBlock: '', pagintion: true,
      displayedColumns: this.languageFlag == 'English' ? this.displayedColumns : this.marathiDisplayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: this.languageFlag == 'English' ? this.displayedheaders : this.marathiDisplayedheaders
    };
    this.apiService.tableData.next(tableData);
  }


  getTableData(flag?:any) {
    this.ngxSpinner.show(); 
   this.pageNumber =  flag == 'filter' ? 1 : this.pageNumber 
    let str = `?pageno=${this.pageNumber}&pagesize=10&textSearch=${this.searchContent.value || ''}&lan=${this.languageFlag || ''}`;
    
    this.apiService.setHttp('GET', 'zp-osmanabad/Student/GetAll' +  str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.ngxSpinner.hide();
         this.tableDataArray = res.responseData.responseData1;
         this.totalCount = res.responseData.responseData2.pageCount; 
          this.tableDataArray.map((res: any) => {
            res.docPath = res.documentResponse[0]?.docPath
          }) 
          let obj =  this.tableDataArray[0];
          this.data = {
            headerImage: obj.documentResponse[0].docPath,
            header: this.webService.languageFlag == 'EN' ? obj.fullName : obj.m_FullName,
            subheader: this.webService.languageFlag == 'EN' ? obj.gender : obj.m_Gender,
            labelHeader: this.webService.languageFlag == 'EN' ? ['Father Name', 'Parent Mobile No.','Aadhar No.','Standard','School Name'] : ['वडीलांचे नावं', 'पालक मोबाईल क्र.','आधार क्र.','इयत्ता','शाळेचे नाव'],
            labelKey: this.webService.languageFlag == 'EN' ? ['fatherFullName', 'parentMobileNo', 'aadharNo','standard','schoolName'] : ['m_FatherFullName', 'parentMobileNo','aadharNo','standard','m_SchoolName'],
            Obj: obj,
            chart: false
          }
          
          
        } else {
          this.ngxSpinner.hide();
          this.tableDataArray = [];
          this.totalCount = 0;
        }
        this.setTableData();

      },
      error: ((err: any) => { this.ngxSpinner.hide(); this.errors.handelError(err) })
    });
  }

  viewDetails(obj:any){
    this.data = {
      headerImage: obj.documentResponse[0].docPath,
      header: this.webService.languageFlag == 'EN' ? obj.fullName : obj.m_FullName,
      subheader: this.webService.languageFlag == 'EN' ? obj.gender : obj.m_Gender,
      labelHeader: this.webService.languageFlag == 'EN' ? ['Father Name', 'Parent Mobile No.','Aadhar No.','Standard','School Name'] : ['वडीलांचे नावं', 'पालक मोबाईल क्र.','आधार क्र.','इयत्ता','शाळेचे नाव'],
      labelKey: this.webService.languageFlag == 'EN' ? ['fatherFullName', 'parentMobileNo', 'aadharNo','standard','schoolName'] : ['m_FatherFullName', 'parentMobileNo','aadharNo','standard','m_SchoolName'],
      Obj: obj,
      chart: false
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
    this.searchContent.setValue('');
    this.getTableData();
  } 
}
