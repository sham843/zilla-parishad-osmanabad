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

  setLanguage(className:any){
    this.language.next(className);
  }

  getLangauge(){
    return this.language.asObservable();
  }
}
