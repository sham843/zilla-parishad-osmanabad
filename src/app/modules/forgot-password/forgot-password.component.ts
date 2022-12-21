import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { ValidationService } from 'src/app/core/services/validation.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  hide = true;
  hide1 = true;
  mobileField: boolean = true;
  otpField: boolean = false;
  passwordField: boolean = false;
  mobileForm!: FormGroup;
  otpForm!: FormGroup;
  passwordForm!: FormGroup;
  timeLeft: number = 60;
  interval: any;
  otpStatus: boolean = false;
  obj = {
    "createdBy": 0,
    "modifiedBy": 0,
    "createdDate": new Date(),
    "modifiedDate": new Date(),
    "isDeleted": true,
    "id": 0,
    "mobileNo": "8975545372",
    "otp": "",
    "pageName": "",
    "otpExpireDate": new Date(),
    "isUser": true,
    "email": ""
  }

  constructor(private apiService: ApiService, private common: CommonMethodsService, private router: Router,
    private errors: ErrorsService, public validation: ValidationService, private fb: FormBuilder) { }


  ngOnInit() {
    this.mobileForm = this.fb.group({
      mobileNo: ['', [Validators.required, Validators.pattern(this.validation.mobile_No)]]
    });

    this.otpForm = this.fb.group({
      digitOne: ['', Validators.required],
      digitTwo: ['', Validators.required],
      digitThree: ['', Validators.required],
      digitFour: ['', Validators.required],
      digitFive: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.pattern(this.validation.valPassword)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(this.validation.valPassword)]]
    })

  }

  get fcMobile() { return this.mobileForm.controls };
  get fcOtp() { return this.otpForm.controls };
  get fcPass() { return this.passwordForm.controls };

  startTimer() {
    this.timeLeft = 60;
    this.interval = setInterval(() => {
      if (this.timeLeft < 1) {
        clearInterval(this.interval);
        this.otpStatus = false;
        this.otpField = true;
      }
      else {
        // this.otpField = false;
        this.timeLeft = --this.timeLeft
      }
    }, 1000);
  }

  sendOtp(flag: any) {
    this.mobileForm.invalid ? this.common.snackBar('Please Enter Mobile Number', 1) : '';
    let obj = this.mobileForm.value;
    this.obj.mobileNo = obj.mobileNo;
    if (this.mobileForm.invalid && flag == 'send') {
      return
    }
    else {
      this.apiService.setHttp('post', 'api/OtpTran', false, this.obj, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          res.statusCode == 200 ? (this.common.snackBar(res.statusMessage, 0), this.mobileField = false,
            this.otpField = true, this.otpStatus = true, this.startTimer()) : this.common.snackBar(res.statusMessage, 1);
        },
        error: ((err: any) => { this.errors.handelError(err) })
      })
    }
  }

  pauseTimer() {
    clearInterval(this.interval);
    this.mobileForm.value.mobileNo.setValue('');
  }

  verifyOtp() {
    let obj = this.otpForm.value;
    let otp = obj.digitOne + obj.digitTwo + obj.digitThree + obj.digitFour + obj.digitFive;
    this.obj.otp = otp;
    this.obj.mobileNo = this.mobileForm.value.mobileNo;
    if (this.otpForm.valid) {
      this.apiService.setHttp('post', 'api/OtpTran/VerifyOTP', false, this.obj, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          res.statusCode == 200 ? (this.common.snackBar(res.statusMessage, 0), this.mobileField = false,
            this.otpField = false, this.passwordField = true, clearInterval(this.interval), this.pauseTimer()) : (this.common.snackBar(res.statusMessage, 1), this.timeLeft = 0);
        },
        error: ((err: any) => { this.errors.handelError(err) })
      })
    }
    else {
      this.common.snackBar('Please Enter OTP', 1)
    }
  }

  onSubmit() {
    let obj = this.passwordForm.value;
    if (obj.newPassword == obj.confirmPassword && this.passwordForm.valid) {
      let str = `Password=${obj.newPassword}&NewPassword=${obj.confirmPassword}&MobileNo=${this.mobileForm.value.mobileNo}`;
      this.apiService.setHttp('put', 'zp_osmanabad/user-registration/ForgotPassword?' + str, false, obj, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          res.statusCode == 200 ? (this.common.snackBar(res.statusMessage, 0), this.router.navigate(['/login'])) : this.common.snackBar(res.statusMessage, 1)
        },
        error: ((err: any) => { this.errors.handelError(err) })
      })
    }
    else {
      this.passwordForm.invalid? this.common.snackBar('Please Enter New Password & Confirm Password', 1): this.common.snackBar('New Password & Confirm Password Did Not Match', 1)
    }
  }
}

