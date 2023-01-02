import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/core/services/api.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatPaginatorModule,
  ]
})
export class GridViewComponent {
  
  @Output() gridToChild = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  displayedColumns = new Array();
  tableRecords: any;
  tableSize!: number;
  pageNumber!: number;
  pageIndex!: number;
  tableInfo: any;
  tableHeaders = new Array();

  constructor(private apiService: ApiService,
              public webStorageService: WebStorageService) { }

  ngOnInit() {
    this.tableInfo = [];
    this.apiService.tableData.subscribe((res: any) => {
      this.tableInfo = res;   
      console.log(res);
         
      if (this.tableInfo) {
        this.displayedColumns = this.tableInfo.displayedColumns;
        this.tableSize = this.tableInfo.tableSize;
        this.tableHeaders = this.tableInfo.tableHeaders
        this.pageNumber = this.tableInfo.pageNumber;
        this.tableInfo.tableData ? this.tableRecords = new MatTableDataSource(this.tableInfo.tableData) : this.tableRecords = [];

        this.paginator?._pageIndex != 0 && this.pageIndex != this.pageNumber ? this.paginator?.firstPage() : '';
      }
    })
  }

  action(obj: any, label: string) {
    obj.label = label;
    obj.pageNumber = label == 'Edit' ? this.pageNumber : obj.pageIndex + 1;
    this.pageIndex = obj.pageNumber;
    this.gridToChild.emit(obj);
  }
}
