import { OnInit, Component, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Output() recObjToChild = new EventEmitter<any>();
  @Output() pageEvent = new EventEmitter<any>();
  @Output() onSlide = new EventEmitter<any>();
  displayedColumns = new Array();
  tableRecords: any;
  tableSize!: number;
  pageNumber: number = 1;
  tableInfo: any;
  tableHeaders = new Array();

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.tableData.subscribe((x: any) => {
      this.tableInfo = [];
      this.tableInfo = x;
      if (this.tableInfo) {
        this.displayedColumns = this.tableInfo.displayedColumns;
        this.tableSize = this.tableInfo.tableSize;
        this.tableHeaders = this.tableInfo.tableHeaders
        this.tableInfo.tableData ? this.tableRecords = new MatTableDataSource(this.tableInfo.tableData) : this.tableRecords = [];
      }
    })
  }

  action(obj: any, label: string) {
    obj.label = label;
    obj.pageNumber = this.pageNumber;
    this.recObjToChild.emit(obj);
  }

}
