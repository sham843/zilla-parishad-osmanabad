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
}
