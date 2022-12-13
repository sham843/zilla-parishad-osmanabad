import { AfterViewInit, Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterViewInit {
  @Input() tableInfo!: any;
  displayedColumns!: string[];
  dataSource: any;

  ngAfterViewInit() {
    if (this.tableInfo) {
      this.displayedColumns = this.tableInfo.col;
      this.tableInfo.data ? this.dataSource = new MatTableDataSource(this.tableInfo.data) : this.dataSource = [];
    }
    console.log(this.displayedColumns);
  }

}
