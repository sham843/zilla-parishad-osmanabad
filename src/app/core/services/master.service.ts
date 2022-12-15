import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor() { }

 /*  getAllDistrict() { // get all district 
    return new Observable((obj) => {
      this.apiCall.setHttp('get', 'GetAllDistrict?flag_lang=1', true, false, false, 'baseUrl');
      this.apiCall.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode === "200") {} else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  } */
}
