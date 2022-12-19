import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/services/master.service';

@Component({
  selector: 'app-add-update-office-users',
  templateUrl: './add-update-office-users.component.html',
  styleUrls: ['./add-update-office-users.component.scss']
})
export class AddUpdateOfficeUsersComponent implements OnInit {

  constructor(private masterService: MasterService){}


  ngOnInit(){
    this.getLevelDrop()
  }

  getLevelDrop(){
    this.masterService.GetAllDesignationLevel('mr-IN').subscribe({
      next: (resp: any)=>{
        console.log(" all getLevelDrop:", resp);    
      },
      error: ( error : any)=>{
        console.log("error is :", error);  
      }
    }) 
  }
}
