import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { WebStorageService } from './core/services/web-storage.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'zilla Parishad Osmanabad';
  langTypeName: any;
  classname: any;
  constructor(private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private webStorage: WebStorageService) {
    this.checkBaseUrl();
    this.setTitle();
  }

  ngOnInit() {
    this.webStorage.getTheme().subscribe((res: any) => {
      this.classname = res;
    });
    
    this.webStorage.langNameOnChange.subscribe(lang => {
      this.langTypeName = lang;
      this.setTitle();
    });
  }

  


  checkBaseUrl() {//If base url is log in hide header and footer
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        window.scroll(0, 0);
      }
    });
  }

  setTitle() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd),  // set title dynamic
    ).subscribe(() => {
      var rt = this.getChild(this.activatedRoute);
      console.log("breadcrun", rt?.data._value);
      if(rt?.data._value.breadcrumb){
        let titleName = rt?.data._value?.breadcrumb[rt.data?._value?.breadcrumb?.length - 1]?.title;
        let m_tile =  rt?.data._value?.breadcrumb[rt.data?._value?.breadcrumb?.length - 1]?.m_title
        console.log("titleName", titleName, m_tile);
        rt.data.subscribe(() => {
          this.titleService.setTitle( this.langTypeName == 'EN' ? titleName : m_tile )
        })
      }
    
    });
  }

  getChild(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }


}
