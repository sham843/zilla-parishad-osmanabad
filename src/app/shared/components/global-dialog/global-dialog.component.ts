import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-global-dialog',
  templateUrl: './global-dialog.component.html',
  styleUrls: ['./global-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule]
})
export class GlobalDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GlobalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }



  ngOnInit(): void {
    console.log("data", this.data);

  }

  closeDialog(result: string) {
    this.dialogRef.close(result);
  }

}
