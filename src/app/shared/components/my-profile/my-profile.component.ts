import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';


@Component({
  standalone:true,
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class MyProfileComponent {
userDetails = new Array();
  constructor(private api : ApiService , private error : ErrorsService , private webStorage : WebStorageService)  {}

  ngOnInit(){
    this.getUserById();
  }

  getUserById(){
    this.api.setHttp('get', `zp_osmanabad/app-login/GetTeacherProfile?TeacherId=${this.webStorage.getUserId()}` , false, false, false, 'baseUrl');
        this.api.getHttp().subscribe({
          next: (res: any) => {
            console.log(res);
            res.statusCode == 200 ? this.userDetails = res.responseData : this.userDetails = []; 
          },
          error: (error: any) => {
            this.error.handelError(error.statusMessage)
          }
  })
}

}
