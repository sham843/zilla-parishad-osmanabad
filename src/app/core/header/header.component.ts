import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChangePasswordComponent } from 'src/app/shared/components/change-password/change-password.component';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { MyProfileComponent } from 'src/app/shared/components/my-profile/my-profile.component';
import { WebStorageService } from '../services/web-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @HostBinding('class') className = '';
  UserData: any;

  constructor(
    private overlay: OverlayContainer, 
    private dialog: MatDialog, 
    public webStorage: WebStorageService,
    private router: Router, 
    public translate: TranslateService) { }
  ngOnInit(): void {
    this.translateLanguage(sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English');
    this.UserData = this.webStorage.getLoggedInLocalstorageData();    
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

  logOut() {
    let dialoObj = {
      header: this.webStorage.languageFlag == 'EN' ? 'Confirmation' : 'पुष्टीकरण',
      title: this.webStorage.languageFlag == 'EN' ? 'Do You Want To Logout ?' : 'तुम्हाला लॉगआउट करायचे आहे का ?',
      cancelButton: this.webStorage.languageFlag == 'EN' ? 'Cancel' : 'रद्द करा',
      okButton: this.webStorage.languageFlag == 'EN' ? 'Ok' : 'ठीक आहे'
    }
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {      
      if (result == 'yes') {
        localStorage.clear();
        sessionStorage.clear();
        sessionStorage.setItem('language', "English");
        this.router.navigate(['/home']);
      }
    });
  }


  openMyProfileDialog() {
    this.dialog.open(MyProfileComponent,{
      width: '500px',
    });
  }

  openChangePasswordDialog() {
    this.dialog.open(ChangePasswordComponent);
  }
}
