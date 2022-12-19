import { Component } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-card-grid-view',
  templateUrl: './card-grid-view.component.html',
  styleUrls: ['./card-grid-view.component.scss']
})
export class CardGridViewComponent {
  tableInfo: any
  constructor(private apiService: ApiService){

  }


  ngOnInit(){
    // this.apiService.tableData.subscribe({
    //   next: (resp: any)=> {
    //     console.log("response is", resp);       
    //   },
    //   error: (error: any)=> {
    //     console.log("response is", error);   
    //   }
    // });

    this.tableInfo = [];
    this.apiService.tableData.subscribe((res: any) => {
      this.tableInfo = res;
      if (this.tableInfo) {
      console.log("card table dara", this.tableInfo);
      
      }
    })
}
}
