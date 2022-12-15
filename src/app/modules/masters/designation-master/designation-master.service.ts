import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesignationMasterService {
  tableData = new BehaviorSubject<any>([]);
  constructor(public http:HttpClient) { }
  
  getDesignation(pageNo:number, searchtext:any){
    const options = {
      headers: new HttpHeaders({
        "UserId": '23985',
        "Authorization": "Bearer " + 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMjM4OTUiLCJleHAiOjE2NzEwODQxMTUsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTY2OTAiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjU2NjkwIn0.4kr0mMLiwCFTOUH3yC1n-y__jrnR8li1gyl242FZ7cw', // token set
        'Content-Type': 'application/json',
      }),
    };
    let url= 'https://aws-stpltrack-vehicletracking.mahamining.com/fleet-express/userdetail/get-user-list?vehicleOwnerId=256&Subusertypeid=&SearchText='+(searchtext?searchtext:"")+'&District=0&TalukaId=0&NoPage='+pageNo+'&RowsPerPage=10';
    return this.http.get(url, options)
  }
  
}
