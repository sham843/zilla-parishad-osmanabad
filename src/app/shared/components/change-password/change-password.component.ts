import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({standalone:true,
  imports: [MatButtonModule,CommonModule,MatTooltipModule, MatIconModule, MatFormFieldModule,ReactiveFormsModule,MatInputModule,TranslateModule,FormsModule,MatCardModule,MatDialogModule],
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  hide = true;
  hide1 = true;
  hide2 = true;
  passwordForm !: FormGroup;

  constructor(private fb : FormBuilder, public validation : ValidationService, private error :ErrorsService,
    private webStorage : WebStorageService, private api : ApiService, private router : Router,
     public dialogRef: MatDialogRef<ChangePasswordComponent>, private common : CommonMethodsService) { dialogRef.disableClose = true;}

  ngOnInit(){
    this.defaultForm();
  }

  defaultForm(){
    this.passwordForm = this.fb.group({
      currentPassword : ['' , [Validators.required, Validators.pattern(this.validation.valPassword)]],
      newPassword : ['' , [Validators.required, Validators.pattern(this.validation.valPassword)]],
      confirmPassword : ['' , [Validators.required, Validators.pattern(this.validation.valPassword)]]
    })
  }

  get fc() {return this.passwordForm.controls}

  onSubmit(clear : any){
    let obj = this.passwordForm.value;
    if(this.passwordForm.invalid){
      return;
    }
    else{
      if(obj.currentPassword == obj.newPassword){
        this.common.snackBar( this.webStorage.languageFlag == 'EN' ?'New Password Must Be Different From Current Password' :'नवीन पासवर्ड आणि सध्याच्या पासवर्ड वेगळा असणे आवश्यक आहे', 1);
        return
      }
      else if(obj.newPassword != obj.confirmPassword){
        this.common.snackBar(this.webStorage.languageFlag == 'EN' ?'New Password and Confirm Password Does Not Match' :'नवीन पासवर्ड आणि कन्फर्म पासवर्ड जुळत नाही', 1);
        return
      }
      else{
        let changePasswordObj = {
          userId: this.webStorage.getUserId(),
          newPassword: this.passwordForm.value.newPassword,
          oldPassword: this.passwordForm.value.currentPassword
        };
        this.api.setHttp('post', 'zp_osmanabad/user-registration/change-password', false, changePasswordObj, false, 'baseUrl');
        this.api.getHttp().subscribe({
          next: (res: any) => {
            if (res.responseData == 'Password Changed Successfully...') {
              this.common.snackBar(res.responseData, 0);
              this.dialogRef.close(); 
              sessionStorage.clear(); localStorage.clear();
              clear.resetForm();
              this.router.navigate(['/login']);
            } else {
              this.common.snackBar(res.responseData, 1);
            }
          },
          error: (error: any) => {
            this.error.handelError(error.statusMessage)
          }
        })
      }
    }
  }
}
