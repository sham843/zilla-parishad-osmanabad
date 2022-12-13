import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateDesignationMasterComponent } from './add-update-designation-master/add-update-designation-master.component';

@Component({
  selector: 'app-designation-master',
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.scss']
})
export class DesignationMasterComponent {
  array: any;
  
  constructor(private dialog: MatDialog) {
    this.array = [
      {
        "userId": 1,
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
      },
      {
        "userId": 1,
        "id": 2,
        "title": "qui est esse",
        "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
      }]
  }

  addUpdateAgency() {
    let obj: any;
    this.dialog.open(AddUpdateDesignationMasterComponent, {
      width: '320px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
  }
}
