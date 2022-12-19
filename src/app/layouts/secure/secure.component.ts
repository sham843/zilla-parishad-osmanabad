import { Component } from '@angular/core';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.scss']
})
export class SecureComponent {
  classname: any;

  constructor(private webStorage: WebStorageService) {
  }

  ngOnInit() {
    this.webStorage.getTheme().subscribe((res: any) => {
      this.classname = res;
    })
  }
}
