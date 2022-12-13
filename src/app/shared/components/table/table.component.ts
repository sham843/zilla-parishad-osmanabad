import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() tableInfo!: any;
  @Output() recObjToChild = new EventEmitter<any>();
  displayedColumns!: string[];
  tableRecords: any;

  ngOnInit() {
    if (this.tableInfo) {
      this.displayedColumns = this.tableInfo.displayedColumns;
      this.tableInfo.tableData ? this.tableRecords = new MatTableDataSource(this.tableInfo.tableData) : this.tableRecords = [];
    }
  }

  action(obj: any, label:string) {
    obj.label = label;
    this.recObjToChild.emit(obj);
  }

}
