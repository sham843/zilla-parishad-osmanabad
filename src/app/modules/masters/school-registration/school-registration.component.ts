import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { AddUpdateSchoolRegistrationComponent } from './add-update-school-registration/add-update-school-registration.component';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';

@Component({
  selector: 'app-school-registration',
  templateUrl: './school-registration.component.html',
  styleUrls: ['./school-registration.component.scss']
})
export class SchoolRegistrationComponent {
  pageNumber: number = 1;
  tableDataArray = new Array();
  searchContent = new FormControl('');
  districtId = new FormControl();
  talukaId = new FormControl('');
  villageId = new FormControl();

  districtArr = new Array();
  talukaArr = new Array();
  villageArr = new Array();
  deleteObj: any;
  cardViewFlag : boolean = false;
  imgPath : any;

  constructor(private dialog: MatDialog, private apiService: ApiService, private errors: ErrorsService,
    private masterService: MasterService,private commonMethod: CommonMethodsService) { }

  ngOnInit() {
    this.getTableData();
    this.getDistrict();
  }

  onPagintion(pageNo: number) {
    this.pageNumber = pageNo;
    this.getTableData()
  }

  getTableData(flag?: string) {
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    let tableDatasize!: Number;
    let str = `?pageno=${this.pageNumber}&pagesize=10&DistrictId=${this.districtId.value ? this.districtId.value : 0}
    &TalukaId=${this.talukaId.value ? this.talukaId.value : 0}&VillageId=${this.villageId.value ? this.villageId.value : 0}&lan=EN`;
    this.apiService.setHttp('GET', 'ZP-Osmanabad/School/GetAll' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({

      next: (res: any) => {
        if (res.statusCode == "200") {
          this.tableDataArray = res.responseData.responseData1;
          console.log("tableDataArray : ",this.tableDataArray);
          
          tableDatasize = res.responseData.responseData2.pageCount;
        } else {
          this.tableDataArray = [];
          tableDatasize = 0;
        }
        let displayedColumns = ['imgPath','srNo', 'schoolName', 'village', 'taluka', 'district', 'action'];
        let displayedheaders = ['#','Sr. No', 'Name', 'Village', 'Taluka', 'District', 'action'];
        let tableData = {
          pageNumber: this.pageNumber,
          img: '#', blink: '', badge: '', isBlock: '', pagintion: true,
          displayedColumns: displayedColumns, tableData: this.tableDataArray,
          tableSize: tableDatasize,
          tableHeaders: displayedheaders
        };
        this.apiService.tableData.next(tableData);
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'Edit' || 'Delete':
        this.addUpdateAgency(obj);
        break;
      // case 'Block':
      //   this.globalDialogOpen();
      //   break;
      case 'Delete':
        this.globalDialogOpen(obj);
        break;
    }
  }

  addUpdateAgency(obj?: any) {
    
    const dialogRef = this.dialog.open(AddUpdateSchoolRegistrationComponent, {
      width: '820px',
      data: obj,
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((result: any) => {
     
      if(result == 'yes'){
        this.getTableData();
      }
    });
  }

  globalDialogOpen(obj: any) {
    this.deleteObj = obj;
    let dialoObj = {
      header: 'Delete',
      title: 'Do You Want To Delete The Selected Content ?',
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
        this.onClickDelete();
      }
    })
  }

  onClear(){
    this.districtId.reset();
    this.talukaId.reset();
    this.villageId.reset();
    this.getTableData();
  }

  getDistrict() {
    this.masterService.getAllDistrict('EN').subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.districtArr = res.responseData;
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getTaluka() {
    this.masterService.getAllTaluka('1').subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.talukaArr = res.responseData;
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getVillage() {
    let talukaId = this.talukaId.value;
    this.masterService.getAllVillage('EN', talukaId).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.villageArr = res.responseData;
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  onClickDelete() {
    let deleteObj = {
      "id": this.deleteObj.id,
      "modifiedBy": 0,
      "modifiedDate": new Date(),
      "lan": "EN"
    }
    this.apiService.setHttp('delete','ZP-Osmanabad/School/Delete', false, deleteObj, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next : ( res : any )=>{
        if(res.statusCode == "200"){
          this.commonMethod.snackBar(res.statusMessage, 0);
          this.getTableData();
        }
      }
    })
    error: (error: any) => {
      this.commonMethod.checkEmptyData(error.statusText) == false ? this.errors.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
    }
  }

  selectGrid(label: string) {
    if (label == 'Table') {
      this.cardViewFlag = false;
      this.getTableData()
    } else if (label == 'Card')
      this.cardViewFlag = true;
  }

}
