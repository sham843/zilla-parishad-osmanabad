import { OnInit, Component, Output, EventEmitter, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { DesignationMasterService } from 'src/app/modules/masters/designation-master/designation-master.service';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() recObjToChild = new EventEmitter<any>();
  @Output() pageEvent = new EventEmitter<any>();
  @Output() onSlide = new EventEmitter<any>();
  displayedColumns= new Array();
  tableRecords: any;
  tableSize!:number;
  pageNumber:number=1;
  tableInfo:any;
  tableHeaders= new Array();
  
  constructor(private designationService:DesignationMasterService){ }

  ngOnInit() {
    this.designationService.tableData.subscribe((x: any) => {
      this.tableInfo=[];
      this.tableInfo=x;
      if (this.tableInfo) {
        this.displayedColumns = this.tableInfo.displayedColumns;
        this.tableSize=this.tableInfo.tableSize;
        this.tableHeaders=this.tableInfo.tableHeaders
        this.tableInfo.tableData ? this.tableRecords = new MatTableDataSource(this.tableInfo.tableData) : this.tableRecords = [];
      }
    })
  }

  action(obj: any, label:string) {
    obj.label = label;
    this.recObjToChild.emit(obj);
  }

  onPagintion(event: any) {
    this.pageNumber= (event.pageIndex+1);
    this.pageEvent.emit(this.pageNumber)
  }
  checkBlock(selectedObj:any){
    this.onSlide.emit(selectedObj)
  }

}
