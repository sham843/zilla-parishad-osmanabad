import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WebStorageService } from '../services/web-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @HostBinding('class') className = '';

  constructor(private overlay: OverlayContainer, private webStorage: WebStorageService, public translate: TranslateService) { }
  ngOnInit(): void {
    this.translateLanguage(sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English');
  }
  
  changeTheme(darkMode: any) {
    let darkClassName: any
    this.className = darkMode == 'light' ? darkClassName = 'lightMode' : darkClassName = 'darkMode';
    this.webStorage.setTheme(darkClassName);
    if (darkMode == 'light') {
      this.overlay.getContainerElement().classList.add('lightMode');
      this.overlay.getContainerElement().classList.remove('lightMode');
    } else {
      this.overlay.getContainerElement().classList.add('darkMode');
      this.overlay.getContainerElement().classList.remove('darkMode');
    }
  }

  translateLanguage(lang: any){
    this.webStorage.setLanguage(lang);
    sessionStorage.setItem('language', lang);
    this.translate.use(lang);
  }

}
