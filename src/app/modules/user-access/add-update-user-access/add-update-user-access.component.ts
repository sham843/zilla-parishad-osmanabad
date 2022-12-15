import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ValidationService } from 'src/app/core/services/validation.service';

@Component({
  selector: 'app-add-update-user-access',
  templateUrl: './add-update-user-access.component.html',
  styleUrls: ['./add-update-user-access.component.scss']
})
export class AddUpdateUserAccessComponent {
  userAccessForm!: FormGroup;
  get f() { return this.userAccessForm.controls; }
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUpdateUserAccessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public validation: ValidationService,

  ) { }

  ngOnInit() {
    this.userFormControl();
  }
  userFormControl() {
    this.userAccessForm = this.fb.group({
      pageName: ['', Validators.required],
      pageNameView: ['', Validators.required],
      pageURL: ['', Validators.required],
      menuIcon: ['', Validators.required],
      sortOrder: ['', Validators.required],
      module: ['', Validators.required]
    })
  }
  //-------------------------------------------------add/update user access----------------------------------------------------------
  userAccessSubmit(formDirective: any) {
    formDirective
/*     if (this.userAccessForm.invalid) {
      formDirective
      return
    } else {
      let obj = {
        "pageId": 0,
        "pageName": this.userAccessForm.value.pageName,
        "pageNameView": this.userAccessForm.value.pageNameView,
        "pageType": 0,
        "pageURL": this.userAccessForm.value.pageURL,
        "module": this.userAccessForm.value.module,
        "isSideBarMenu": 0,
        "menuIcon": this.userAccessForm.value.menuIcon,
        "sortOrder": this.userAccessForm.value.sortOrder,
        "createdBy": 0,
        "createdDate": new Date(),
        "isDeleted": false
      }
    this.apiService.setHttp('post', 'pagemaster/AddPage', true, obj, false, 'baseUrl');
      this.apiService.getHttp().subscribe((res:any)=>{
        console.log(res);
      }) 
    } */

  }



  clearUserForm(formDirective: any) {   //clear form
    formDirective.resetForm();
  }
  //----------------------------------------------------Modal-------------------------------------------------------------------------- 
  onNoClick(flag: any) {
    if (flag == 'yes') {
      this.dialogRef.close(flag)
    } else {
      this.dialogRef.close(flag)
    }
  }
}

