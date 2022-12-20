import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ErrorsService } from 'src/app/core/services/errors.service';

@Component({
  selector: 'app-add-update-designation-master',
  templateUrl: './add-update-designation-master.component.html',
  styleUrls: ['./add-update-designation-master.component.scss']
})
export class AddUpdateDesignationMasterComponent {
  designationForm!: FormGroup;
  DesiganationLevelData: any;
  desiganationTypeData: any;
  editFlag: boolean = false;
  editData: any;
  constructor(private masterService: MasterService, private fb: FormBuilder, private service: ApiService,
    private commonMethod: CommonMethodsService, private errorHandler: ErrorsService,
    public dialogRef: MatDialogRef<AddUpdateDesignationMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.formData();
    !this.data ? this.getDesiganationLevel() : this.onClickEdit(this.data);
  }

  get f() { return this.designationForm.controls }
//#region -------------------------------------- Desiganation-Master Formdata --------------------------//
  formData() {
    this.designationForm = this.fb.group({
      "createdBy": [0],
      "modifiedBy": [0],
      "createdDate": new Date(),
      "modifiedDate": new Date(),
      "isDeleted": false,
      "lan": ['EN'],
      "id": [0],
      "designationType": ['',Validators.required],
      "m_DesignationType": [''],
      "designationLevelId": ['',Validators.required],
      "timestamp": new Date(),
      "localId": 0,
   
    })
  }
  //#endregion  ---------------------------- End Desiganation-Master Formdata ------------------------------- //
//#region ----------------------------------Desiganation-Master Dropdown ------------------------------- //
  getDesiganationLevel() {
    let lan = this.designationForm.value.lan;
    this.masterService.GetAllDesignationLevel(lan).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.DesiganationLevelData = res.responseData;
          this.editFlag ? (this.designationForm.controls['designationLevelId'].setValue(this.editData.designationLevel), this.getDesiganationType()) : '';
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getDesiganationType() {
    let getFormVal = this.designationForm.value;
    let getDesignationLevelId: any = this.commonMethod.getkeyValueByArrayOfObj(this.DesiganationLevelData, 'designationLevel', getFormVal?.designationLevelId);
    let desigLevelId = getDesignationLevelId?.id

    this.masterService.GetDesignationByLevelId(getFormVal.lan, desigLevelId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200' && res.responseData.length) {
          this.desiganationTypeData = res.responseData;
          this.editFlag ? (this.designationForm.controls['designationType'].setValue(this.editData.designationName)) : '';
        }
      }), error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })

  }
//#endregion  -------------------------------- End Desiganation-Master Dropdown ------------------------------- //

//#region ------------------------------------- Desiganation-Master Submit ---------------------------------// 
  OnSubmit() {  
    let getFormVal = this.designationForm.value;
    let getDesignationLevelId: any = this.commonMethod.getkeyValueByArrayOfObj(this.DesiganationLevelData, 'designationLevel', getFormVal?.designationLevelId);  
    this.designationForm.value.designationLevelId = getDesignationLevelId.id;
    let postObj = this.designationForm.value;
   
    let url;
    this.editFlag ? url = 'zp_osmanabad/designation-master/UpdateRecord' : url = 'zp_osmanabad/designation-master/AddDesignation'
    this.service.setHttp(this.editFlag ? 'put' : 'post', url, false, postObj, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        // this.ngxspinner.hide();
        if (res.statusCode == '200') {
          this.dialogRef.close('Yes');
        } else {
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        // this.ngxspinner.hide();
        this.commonMethod.checkEmptyData(error.statusMessage) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
      }
    })
  }
//#endregion -------------------------------------End Desiganation-Master Submit ---------------------------------//

//#region  ------------------------------------- Desiganation-Master Edit ---------------------------------//
  onClickEdit(obj: any) {
    this.editFlag = true;
    this.editData = obj;
    this.designationForm.patchValue({
      id: obj.id,
    });
    this.getDesiganationLevel();
  }
//#endregion -------------------------------------End Desiganation-Master Edit ---------------------------------//
//#region  ------------------------------------- Desiganation-Master Clear ---------------------------------//
   clearForm(formControlName: any) {
    if (formControlName == 'designationLevelId') {
      this.designationForm.controls['designationType'].setValue('');
    } 
  }
 // #endregion -------------------------------------End Desiganation-Master Clear ---------------------------------//
}
