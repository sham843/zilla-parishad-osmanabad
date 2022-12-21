import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebStorageService {
  languageFlag =  'EN';
  language = new BehaviorSubject('');
  private theme=new BehaviorSubject('');

  constructor() { }

  getTheme(){
    return this.theme.asObservable();
  }
  setTheme(className:any){
    this.theme.next(className);
  }

  setLanguage(lang:any){
    this.language.next(lang);
    lang == 'English' ? this.languageFlag = 'EN' : this.languageFlag = 'MR';
  }

  getLangauge(){
    return this.language.asObservable();
  }

  checkUserIsLoggedIn() { // check user isLoggedIn or not
    let sessionData: any = sessionStorage.getItem('loggedIn');
    sessionData == null || sessionData == '' ? localStorage.clear() : '';
    if (localStorage.getItem('loggedInData') && sessionData == 'true') return true;
    else return false;
  }

  getLoggedInLocalstorageData() {
    if (this.checkUserIsLoggedIn() == true) {
      let data = JSON.parse(localStorage['loggedInData']);
      return data;
    }
  }

  getUserId(){
    let data =this.getLoggedInLocalstorageData();
    return data.responseData.id
  }

  createdByProps(): any {
    return {
      "createdBy": this.getUserId() || 0,
      "modifiedBy": this.getUserId() || 0,
      "createdDate": new Date(),
      "modifiedDate": new Date(),
      "isDeleted": true
    }
  }
}
