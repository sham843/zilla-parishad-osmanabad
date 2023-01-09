import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebStorageService {
  languageFlag =  'EN';
  language = new BehaviorSubject('');
  selectedBarchartObjData = new BehaviorSubject('');
  selectedLineChartObj= new BehaviorSubject('');
  langNameOnChange = this.language.asObservable();
  private theme=new BehaviorSubject('');
  numFormat: any;
  selectedTheme = 'light';

  constructor() { }

  getTheme(){
    return this.theme.asObservable();
  }
  setTheme(className:any){
    this.theme.next(className);
    this.selectedTheme = className == 'lightMode' ? 'light' : 'dark';
  }

  setLanguage(lang:any){
    this.language.next(lang);
    lang == 'English' ? this.languageFlag = 'EN' : this.languageFlag = 'mr-IN';
    this.numFormat = lang == 'Marathi' ? 'mr-IN' : 'en-IN';
  }

  getLangauge(){
    return this.languageFlag;
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
    return data.id;
  }

  getUserTypeId(){
    let data =this.getLoggedInLocalstorageData();
    return data.userTypeId;
  }

  getUserSubTypeId(){
    let data =this.getLoggedInLocalstorageData();
    return data.subUserTypeId;
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

  numberTransformFunction(value: any){
    let number = new Intl.NumberFormat(this.numFormat).format(value);        
      return number
  }

  getAllPageName(){
    if (this.checkUserIsLoggedIn() == true) {      
      let getAllPageName = this.getLoggedInLocalstorageData();
      return getAllPageName.pageLstModels;
    }
  }
}
