import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    public validators : ValidationService) { }

  ngOnInit() {
    this.formData();
  }

  formData() {
    this.adminLoginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      mobileNo: ['', [Validators.required,Validators.pattern(this.validators.mobile_No)]],
      passwordOff: ['', [Validators.required]]
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
      this.adminLoginForm.controls['userName'].updateValueAndValidity();
      this.adminLoginForm.controls['password'].setValidators([Validators.required]);
      this.adminLoginForm.controls['password'].updateValueAndValidity();

      this.adminLoginForm.controls['mobileNo'].setValidators([]);
      this.adminLoginForm.controls['mobileNo'].updateValueAndValidity();
      this.adminLoginForm.controls['passwordOff'].setValidators([]);
      this.adminLoginForm.controls['passwordOff'].updateValueAndValidity();
    } else {
      this.adminLoginForm.controls['mobileNo'].setValidators([Validators.required]);
      this.adminLoginForm.controls['mobileNo'].updateValueAndValidity();
      this.adminLoginForm.controls['passwordOff'].setValidators([Validators.required]);
      this.adminLoginForm.controls['passwordOff'].updateValueAndValidity();

      this.adminLoginForm.controls['userName'].setValidators([]);
      this.adminLoginForm.controls['userName'].updateValueAndValidity();
      this.adminLoginForm.controls['password'].setValidators([]);
      this.adminLoginForm.controls['password'].updateValueAndValidity();
    }
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
          } else {
            this.commonMethods.snackBar(res.statusMessage, 1)
          }
        }),
        error: ((err: any) => { this.errors.handelError(err) })
      })
    }


  }
}
