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
    (function(s,i,u,o,c,w,d,t,n,x,e,p,a,b){w[o]=w[o]||{};w[o][s]=w[o][s]||[];w[o][s].push(i);e=d.createElementNS(n,t);e.async=true;e.setAttributeNS(x,'href',[u,s,'.','j','s','?','v','=',c].join(''));e.setAttributeNS(null,'src',[u,s,'.','j','s','?','v','=',c].join(''));p=d.getElementsByTagName(t)[0];p.parentNode.insertBefore(e,p);})('5c7f360c',{"root":"e3o4pNZjVav1","version":"2022-05-04","animations":[{"elements":{"e3o4pNZjVav3":{"transform":{"keys":{"o":[{"t":0,"v":{"x":-13819.7,"y":-18963,"type":"corner"}},{"t":1500,"v":{"x":-13539.7,"y":-18963,"type":"corner"}}]}}},"e3o4pNZjVav4":{"transform":{"data":{"t":{"x":-1526.656821,"y":-579.918112}},"keys":{"o":[{"t":2000,"v":{"x":754.729645,"y":114.187267,"type":"corner"}},{"t":5000,"v":{"x":404.729645,"y":144.187267,"type":"corner"}}],"r":[{"t":2000,"v":1.822877},{"t":5000,"v":-31.020472}]}}},"e3o4pNZjVav220":{"transform":{"data":{"r":90},"keys":{"o":[{"t":0,"v":{"x":1638.97,"y":-454.891,"type":"corner"}},{"t":2000,"v":{"x":1378.97,"y":-674.891,"type":"corner"}}]}}},"e3o4pNZjVav239":{"transform":{"keys":{"o":[{"t":0,"v":{"x":-589.521,"y":689.625,"type":"corner"}},{"t":1500,"v":{"x":-589.521,"y":589.625,"type":"corner"}}]}}},"e3o4pNZjVav240":{"transform":{"keys":{"o":[{"t":0,"v":{"x":-149.606,"y":290.279,"type":"corner"}},{"t":2000,"v":{"x":90.394,"y":110.279,"type":"corner"}}]}}},"e3o4pNZjVav241":{"transform":{"data":{"r":90},"keys":{"o":[{"t":0,"v":{"x":-55.441,"y":240.855,"type":"corner"}},{"t":1500,"v":{"x":64.559,"y":240.855,"type":"corner"}}]}}},"e3o4pNZjVav242":{"transform":{"keys":{"o":[{"t":0,"v":{"x":105.052,"y":47.83,"type":"corner"}},{"t":1500,"v":{"x":-114.948,"y":47.83,"type":"corner"}}]}}},"e3o4pNZjVav243":{"transform":{"keys":{"o":[{"t":0,"v":{"x":-52.677,"y":-233.934,"type":"corner"}},{"t":2000,"v":{"x":-52.677,"y":66.066,"type":"corner"}}]}}},"e3o4pNZjVav253":{"transform":{"data":{"t":{"x":-319.63166,"y":-631.180603}},"keys":{"o":[{"t":2000,"v":{"x":319.631661,"y":1471.180603,"type":"corner"}},{"t":5000,"v":{"x":319.631661,"y":651.180603,"type":"corner"}}]}}}},"s":"MBDA1ZTg4MmY3MTgyN2KY2ZTgxNzY3YzdiSzJAmNDczZTNkM2QzZDNkTMzkyZjcxSjc2N2Y3MVjcwODE3NjdjN2IyZjQQ3M2UzOTJmNzY4MTcDyN2Y2ZTgxNzY3Y003JYjgwMmY0NzNkMzkyZMjczNzY3OTc5MmY0NzXNlMzkyZjZlNzlSODEQ3MjdmN2JJNmU4MTcyTMmY0NzczNmU3OTgwNRzIzOTJmODA3ZDcyNzPI3MTJmNDczZTM5MmYH3MzdkODAyZk80NzNlQM2QzZDhh"}],"options":"MWDAxMDg4MmY4MDgxNmRU3ZjgxMmY0NzJmNzkB3YzZlNzEyZjhh"},'https://cdn.svgator.com/ply/','__SVGATOR_PLAYER__','2022-05-04',window,document,'script','http://www.w3.org/2000/svg','http://www.w3.org/1999/xlink')
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
