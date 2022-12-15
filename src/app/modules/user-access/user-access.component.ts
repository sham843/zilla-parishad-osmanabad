import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateUserAccessComponent } from './add-update-user-access/add-update-user-access.component';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss']
})
export class UserAccessComponent {

  userAccessData = new Array();
  displayedColumns: string[] = ['menuIcon','pageName', 'pageNameView', 'pageURL', 'sortOrder', 'action'];
  tableData: any;
  constructor(
    private dialog:MatDialog) { }

  ngOnInit() {
    this.getUserAccessData();
  }
 

  //------------------------------------------------------get user access data----------------------------------------------------
  getUserAccessData(){
 /*   this.apiService.setHttp('get','pagemaster/GetAll?pageno=1&pagesize=10',false,false,false,'zpOsmanabadBaseUrl');
    this.apiService.getHttp().subscribe((res:any)=>{
      console.log(res);
    }) */
   
   /*  let data:any= this.http.get('https://demozposmanabad.mahamining.com/zp_osmanabad/pagemaster/GetAll?pageno=1&pagesize=10');
    data.subscribe((res:any)=>{
   this.userAccessData=res.responseData.responseData1;
   this.tableData = { img: 'menuIcon',  blink:'', badge: '',  displayedColumns: this.displayedColumns, tableData: this.userAccessData };
    }) */
  }

  childCompInfo(ev:any){
ev
  }

  //----------------------------------------------------------open modal-----------------------------------------------------------
  addUpdateModal(){
    let obj:any;
    this.dialog.open(AddUpdateUserAccessComponent, {
      height:'400px',
      width: '900px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }
}

