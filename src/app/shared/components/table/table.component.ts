import { OnInit, Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from 'src/app/core/services/api.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DashPipe } from 'src/app/core/pipes/dash.pipe';
import { NumberTransformPipe } from 'src/app/core/pipes/number-tranform.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatCardModule, MatMenuModule, CommonModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    DashPipe,
    NumberTransformPipe,
    MatCheckboxModule
    ],

})
export class TableComponent implements OnInit {
  @Output() recObjToChild = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = new Array();
  tableRecords: any;
  tableSize!: number;
  pageNumber!: number;
  pageIndex!: number;
  tableInfo: any;
  tableHeaders = new Array();
  highlightedRow!: number;
  constructor(private apiService: ApiService) { }


  ngOnInit() {
    this.tableInfo = [];
    this.apiService.tableData.subscribe((res: any) => {
      this.tableInfo = res;
      if (this.tableInfo) {
        this.highlightedRow = this.tableInfo.highlightedRow;
        this.displayedColumns = this.tableInfo.displayedColumns;
        this.tableSize = this.tableInfo.tableSize;
        this.tableHeaders = this.tableInfo.tableHeaders
        this.pageNumber = this.tableInfo.pageNumber;
        this.tableInfo.tableData ? this.tableRecords = new MatTableDataSource(this.tableInfo.tableData) : this.tableRecords = [];

        this.paginator?._pageIndex != 0 && this.pageIndex != this.pageNumber ? this.paginator?.firstPage() : '';
        this.tableRecords.sort = this.sort;

        console.log("tableData",this.tableInfo.tableData);
        console.log("table size : ", this.tableInfo.tableSize);
      }
    })
  }

  // ngAfterViewInit() {
  //   this.tableInfo.sort = this.sort;
  // }

  action(obj: any, label: string, i?: any) {        
    label == 'checkBox' ? obj.checkBoxValue = i.checked : this.highlightedRow = i;
    obj.label = label;
    obj.pageNumber = obj.pageIndex + 1;
    this.pageIndex = obj.pageNumber;
    this.recObjToChild.emit(obj);
  }
}
