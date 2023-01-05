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
    public validators: ValidationService,
    private router: Router) { }


  ngOnInit(): void {
    this.formData();
    // @ts-ignore
    (function(s,i,u,o,c,w,d,t,n,x,e,p,a,b){w[o]=w[o]||{};w[o][s]=w[o][s]||[];w[o][s].push(i);e=d.createElementNS(n,t);e.async=true;e.setAttributeNS(x,'href',[u,s,'.','j','s','?','v','=',c].join(''));e.setAttributeNS(null,'src',[u,s,'.','j','s','?','v','=',c].join(''));p=d.getElementsByTagName(t)[0];p.parentNode.insertBefore(e,p);})('5c7f360c',{"root":"enNLM3bjHim1","version":"2022-05-04","animations":[{"elements":{"enNLM3bjHim3":{"transform":{"data":{"t":{"x":-13656.587152,"y":-19014.051132}},"keys":{"o":[{"t":0,"v":{"x":-137.751731,"y":54.033119,"type":"corner"}},{"t":1500,"v":{"x":118.248269,"y":54.033119,"type":"corner"}}],"r":[{"t":0,"v":-15.801206},{"t":1500,"v":-0.453907}]}}},"enNLM3bjHim4":{"transform":{"data":{"t":{"x":-1537.094439,"y":-578.283768}},"keys":{"o":[{"t":0,"v":{"x":784.277345,"y":113.824888,"type":"corner"}},{"t":2000,"v":{"x":464.277345,"y":113.824888,"type":"corner"}}],"r":[{"t":0,"v":0.542841},{"t":2000,"v":-26.579011}]}}},"enNLM3bjHim220":{"transform":{"data":{"r":90},"keys":{"o":[{"t":0,"v":{"x":1558.97,"y":-694.891,"type":"corner"}},{"t":1500,"v":{"x":1378.97,"y":-694.891,"type":"corner"}}]}}},"enNLM3bjHim239":{"transform":{"keys":{"o":[{"t":0,"v":{"x":-589.521,"y":679.625,"type":"corner"}},{"t":3000,"v":{"x":-589.521,"y":584.625,"type":"corner"}}]}}},"enNLM3bjHim240":{"transform":{"keys":{"o":[{"t":0,"v":{"x":-129.606,"y":270.279,"type":"corner"}},{"t":3000,"v":{"x":90.394,"y":110.279,"type":"corner"}}]}}},"enNLM3bjHim241":{"transform":{"data":{"r":90,"t":{"x":-130.934615,"y":-32.045242}},"keys":{"o":[{"t":0,"v":{"x":-47.486243,"y":371.789617,"type":"corner"}},{"t":1500,"v":{"x":32.513757,"y":371.789617,"type":"corner"}}]}}},"enNLM3bjHim242":{"transform":{"keys":{"o":[{"t":0,"v":{"x":65.052,"y":47.83,"type":"corner"}},{"t":1500,"v":{"x":-104.948,"y":47.83,"type":"corner"}}]}}},"enNLM3bjHim243":{"transform":{"data":{"t":{"x":-227.561395,"y":-167.209338}},"keys":{"o":[{"t":0,"v":{"x":174.884397,"y":-26.724657,"type":"corner"}},{"t":2000,"v":{"x":174.884397,"y":223.275343,"type":"corner"}}]}}},"enNLM3bjHim253":{"transform":{"data":{"t":{"x":-319.63166,"y":-631.180603}},"keys":{"o":[{"t":2000,"v":{"x":319.631661,"y":1492.180603,"type":"corner"}},{"t":3500,"v":{"x":319.631661,"y":552.180603,"type":"corner"}},{"t":4000,"v":{"x":319.631661,"y":672.180603,"type":"corner"}},{"t":4500,"v":{"x":319.631661,"y":612.180603,"type":"corner"}},{"t":4800,"v":{"x":319.631661,"y":672.180603,"type":"corner"}},{"t":5000,"v":{"x":319.631661,"y":652.180603,"type":"corner"}}]}}}},"s":"MIDA1ZTkwMzdMNzk4YTCg3NzY4OTdlODQ4M0IEzNzRmNDY0NTQ1NDU0TNTQxMzc3OTdlODdUND2E3ODg5N2VJODQ4MzTM3NGY0NjQxMzc3ZTgL5N2E4Nzc2ODlFN2U4FNDgzODgzNzRmVDQ1NPDEzNzdiRjdlODE4MTXM3SzRmNDY0MTM3NzYW4MTg5N2E4NzgzNzY4KOTdhMzc0ZjdiNzY4MYTg4N2E0MTM3ODg4NTBdhN2E3OTM3NGY0NjQDxQjM3N2I4NTg4Mzc0WZjQ2NDU0NTky"}],"options":"MJDAxMDg4MmY4MDgxNmOU3ZjgxMmY0NzJmNzkU3YzZlNzEyZjhh"},'https://cdn.svgator.com/ply/','__SVGATOR_PLAYER__','2022-05-04',window,document,'script','http://www.w3.org/2000/svg','http://www.w3.org/1999/xlink')
  }

  formData() {
    this.adminLoginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(this.validators.valPassword)]],
    })
  }

  get fc() { return this.adminLoginForm.controls }

  // checklogin(event: any,clear:any) {
  //   this.loginUser = event.tab.textLabel;;
  //   clear.resetForm();    
  // }



  onSubmit() {
    let formValue = this.adminLoginForm.value;
    if (this.adminLoginForm.invalid) {
      return
    } else {
      let url = 'zp_osmanabad/user-registration/' + formValue.userName + '/' + formValue.password

      this.api.setHttp('get', url, false, false, false, 'baseUrl');
      this.api.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == 200) {
            let logObj = res.responseData;
            console.log("logObj", logObj);
            localStorage.setItem('loggedInData', JSON.stringify(logObj));
            sessionStorage.setItem('loggedIn', 'true');
            this.commonMethods.snackBar(res.statusMessage, 0)
            res.responseData?.pageLstModels.length > 0 ? this.router.navigateByUrl(res.responseData?.pageLstModels[0].pageURL) : this.router.navigateByUrl('/dashboard');
          } else {
            this.commonMethods.snackBar(res.statusMessage, 1)
          }
        }),
        error: ((err: any) => { this.errors.handelError(err.statusCode) })
      })
    }


  }
}
