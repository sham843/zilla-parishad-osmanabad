import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-card-grid-view',
  templateUrl: './card-grid-view.component.html',
  styleUrls: ['./card-grid-view.component.scss']
})
export class CardGridViewComponent {
  @Output() recObjToChild = new EventEmitter<any>();

  tableRecords!:Observable<any> | any;
  tableSize!: number;
  pageNumber!: number;
  pageIndex!: number;
  tableInfo: any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getCardData();
  }

  getCardData() {
    // this.tableInfo = [];
    this.apiService.DataForGrid.subscribe({
      next: (resp: any) => {
        console.log("response is ", resp);
        this.tableInfo = resp;
        this.tableInfo.tableData ? this.tableRecords = new MatTableDataSource(this.tableInfo.tableData) : this.tableRecords = [];
        this.tableSize = this.tableInfo.tableSize;
        // this.tableInfo.tableData ? this.tableRecords = (this.tableInfo.tableData) : this.tableRecords = [];
        console.log("jdcdckj", this.tableRecords);
      },
      error: (error: any) => {
        console.log("error is ", error);
      }
    })
  }
  action(obj: any, label: string) {
    obj.label = label;
    obj.pageNumber = obj.pageIndex + 1;
    this.pageIndex = obj.pageNumber;
    this.recObjToChild.emit(obj);
  }
}
