import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { StudentDetailsComponent } from 'src/app/modules/masters/student-registration/student-details/student-details.component';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-global-details',
  templateUrl: './global-details.component.html',
  styleUrls: ['./global-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    TableComponent,
    StudentDetailsComponent
  ]
})
export class GlobalDetailsComponent {
  pageNumber: number = 1;
  tableDataArray = new Array();
  totalCount!:number;
  tableDatasize!: Number;
  languageFlag!: string;
  editStudentId:any;
  currentItem:any

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

  ){}
  ngOnInit(){
    this.route.paramMap.subscribe((params) => {
      this.editStudentId = params.get('id');
    })
    console.log();
    
    this.languageFlag = this.webService.languageFlag;
    this.getTableData();
  }


  getTableData(flag?: string) {
    this.ngxSpinner.show();
    console.log(flag);
    
    // this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
   
    let str = `?pageno=${this.pageNumber}&pagesize=10&textSearch=${''}&lan=${this.languageFlag || ''}`;
    
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
          let obj =  this.tableDataArray.find((res:any) => res.id == this.editStudentId)
          if(obj){
            this.currentItem = obj;
          }else{
            this.pageNumber = this.pageNumber+1;
            this. getTableData();
            
          }
        } else {
          this.ngxSpinner.hide();
          this.tableDataArray = [];
          this.totalCount = 0;
        }

        let tableData = {
          pageNumber: this.pageNumber,
          img: 'docPath', blink: true, badge: '', isBlock: '', pagintion: false,
          displayedColumns: this.languageFlag == 'EN' ? this.displayedColumns : this.marathiDisplayedColumns,
          tableData: this.tableDataArray,
          tableSize: this.totalCount,
          tableHeaders: this.languageFlag == 'EN' ? this.displayedheaders : this.marathiDisplayedheaders
        };
        this.apiService.tableData.next(tableData);

      },
      error: ((err: any) => { this.ngxSpinner.hide(); this.errors.handelError(err) })
    });
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
    }
  }

  // addUpdateAgency(obj?: any) {
  //   console.log(obj);
  //   const dialogRef = this.dialog.open(AddUpdateStudentRegistrationComponent, {
  //     width: '900px',
  //     height: '650px',
  //     data: obj,
  //     disableClose: true,
  //     autoFocus: false
  //   });
  //   dialogRef.afterClosed().subscribe((result: any) => {
  //     if (result == 'yes' && obj) {
  //       this.pageNumber = obj.pageNumber;
  //     } else if (result == 'yes') {
  //       this.pageNumber = 1;
  //     }
  //     this.getTableData();
  //   });
  // }
}
