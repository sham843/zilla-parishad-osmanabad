import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { ValidationService } from 'src/app/core/services/validation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true;
  adminLoginForm!: FormGroup;
  loginUser: string = 'Admin';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private errors: ErrorsService,
    private commonMethods: CommonMethodsService,
    public validators : ValidationService,
    private router: Router) { }

  ngOnInit() {
    this.formData();
  }

  formData() {
    this.adminLoginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required,Validators.pattern(this.validators.valPassword)]],
      mobileNo: ['', [Validators.required,Validators.pattern(this.validators.mobile_No)]],
      passwordOff: ['', [Validators.required,Validators.pattern(this.validators.valPassword)]]
    })
  }

  get fc() { return this.adminLoginForm.controls }

  checklogin(event: any,clear:any) {
    this.loginUser = event.tab.textLabel;;
    clear.resetForm();    
  }

  updateValidations() {
    if (this.loginUser == 'Admin') {
      this.adminLoginForm.controls['userName'].setValidators([Validators.required]);
      this.adminLoginForm.controls['password'].setValidators([Validators.required,Validators.pattern(this.validators.valPassword)]); 
      this.adminLoginForm.controls['mobileNo'].setValidators([]);
      this.adminLoginForm.controls['passwordOff'].setValidators([]);      
    } else {
      this.adminLoginForm.controls['mobileNo'].setValidators([Validators.required,Validators.pattern(this.validators.mobile_No)]);
      this.adminLoginForm.controls['passwordOff'].setValidators([Validators.required,Validators.pattern(this.validators.valPassword)]);
      this.adminLoginForm.controls['userName'].setValidators([]);
      this.adminLoginForm.controls['password'].setValidators([]);
    }
    this.adminLoginForm.controls['userName'].updateValueAndValidity();
    this.adminLoginForm.controls['password'].updateValueAndValidity();
    this.adminLoginForm.controls['mobileNo'].updateValueAndValidity();
    this.adminLoginForm.controls['passwordOff'].updateValueAndValidity();
  }

  onSubmit() {
    let formValue = this.adminLoginForm.value;
    this.updateValidations();
    if (this.adminLoginForm.invalid) {
      return
    } else {
      let url = this.loginUser == 'Admin' ? 'zp_osmanabad/user-registration/' + formValue.userName + '/' + formValue.password : 'zp_osmanabad/user-registration/' + formValue.mobileNo + '/' + formValue.passwordOff

      this.api.setHttp('get', url, false, false, false, 'baseUrl');
      this.api.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            let logObj = res.responseData;
            localStorage.setItem('loggedInData', JSON.stringify(logObj));
            sessionStorage.setItem('loggedIn', 'true');
            this.commonMethods.snackBar(res.statusMessage, 0)
            this.router.navigateByUrl('/dashboard');
          } else {
            this.commonMethods.snackBar(res.statusMessage, 1)
          }
        }),
        error: ((err: any) => { this.errors.handelError(err) })
      })
    }


  }
}
