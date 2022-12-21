import { Injectable } from '@angular/core';
import { MatSnackBar, } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class CommonMethodsService {

  constructor(private SnackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  snackBar(data: string, status: number) {
    let snackClassArr: any = ['snack-success', 'snack-danger', 'snack-warning'];
    this.SnackBar.open(data, " ", {
      duration: 2000,
      panelClass: [snackClassArr[status]],
      verticalPosition: 'top', // 'top' | 'bottom'
      horizontalPosition: 'right', //'start' | 'center' | 'end' | 'left' | 'right'
    })
  }

  sanckBarHide() {
    this.SnackBar.dismiss();
  }

  checkEmptyData(data: any) {
    let value: any;
    if (data == "" || data == null || data == "null" || data == undefined || data == "undefined" || data == 'string' || data == null || data == 0) {
      value = false;
    } else {
      value = true;
    }
    return value;
  }

  routerLinkRedirect(path: any) {
    this.router.navigate([path], { relativeTo: this.activatedRoute })
  }

  isEmptyArray(array: any) {
    if (array == null || array == undefined || array.length <= 0) {
      return true;
    } else {
      return false;
    }
  }



  getkeyValueByArrayOfObj(array: any, key: string, val: any) {
    let res = array.find((ele: any) => {
      if (ele[key] == val) {
        return ele
      }
    })
    return res
  }
}
