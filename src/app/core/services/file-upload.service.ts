import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CommonMethodsService } from './common-methods.service';
import { ErrorsService } from './errors.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private apiService: ApiService,
              private spinner: NgxSpinnerService,
              private error: ErrorsService,
              private commonService: CommonMethodsService ) { }

  // uploadDocuments(event: any, folderName?: any, allowedDocTypes?: any, minsize?: any, maxsize?: any){
  uploadDocuments(event: any, folderName?: any, allowedDocTypes?: any)  {
    return new Observable(obj => {
      const selResult = event.target.value.split('.');
      const docExt = selResult.pop();
      docExt.toLowerCase();
      if (allowedDocTypes.match(docExt)) {
        if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          if (file.size > 10485760) {
            obj.error("Required file size should be less than " + 10 + " MB.");
          }
          else {
            const reader: any = new FileReader();
            reader.onload = () => {
              const formData = new FormData();
              formData.append('FolderName', folderName);
              formData.append('DocumentType', docExt);
              formData.append('UploadDocPath', file);
              this.apiService.setHttp('post', 'zp_osmanabad/documents/UplodFile', false, formData, false, 'baseUrl');
              this.apiService.getHttp().subscribe({
                next: (res: any) => {
                  this.spinner.hide();
                  if (res.statusCode === "200") {
                    obj.next(res);
                  }
                  else {
                    this.commonService.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
                  }
                },
                error: ((error: any) => {
                  this.error.handelError(error.status);
                })
              })
            }
            reader.readAsDataURL(event.target.files[0]);
          }
        }
      }
      else {
        obj.next('error');
        obj.error("Only " + allowedDocTypes + " file format allowed.");   
        let convertString = JSON.stringify(allowedDocTypes);
        this.commonService.showPopup('Only Supported file Types... '+convertString, 1)
      }
    })
  }



  uploadMultipleDocument(event: any, _folderName?: any, allowedDocTypes?: any) {
    this.spinner.show();
    let docTypeCheckFlag = true;
    return new Observable(obj => {
      const formData = new FormData();
      const selResult1 = event.target.value.split('.');
      const docExt1 = selResult1.pop().toLowerCase();
      let size = docExt1 == 'pdf' ? 500485760 : 10485760;

      if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          if (event.target.files[i].size > size) {
            obj.error("Required file size should be less than " + (docExt1 == 'pdf'? 500 : 10 )+ " MB.");
            this.commonService.showPopup("Required file size should be less than " +(docExt1 == 'pdf'? 500 : 10 ) + " MB.", 1);
            docTypeCheckFlag = false;
          } else {
            formData.append("files", event.target.files[i]);
            let nameText = event.target.files[i].name;
            const selResult = nameText.split('.');
            const docExt = selResult.pop();
            const docExtLowerCase = docExt.toLowerCase();
            if (allowedDocTypes.match(docExtLowerCase)) { }
            else {
              docTypeCheckFlag = false;
            }
          }
        }
      }

      if (docTypeCheckFlag == true) {
        this.apiService.setHttp('post', 'zp_osmanabad/documents/upload-multiple-photos', false, formData, false, 'baseUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode === "200") {
              this.spinner.hide();
              obj.next(res);
            }
            else {
              this.spinner.hide();
              this.commonService.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : ''// this.toastrService.error(res.statusMessage);
            }
          },
          error: ((error: any) => {
            this.spinner.hide();
            this.error.handelError(error.status);
          })
        })
      }
      else {
        this.spinner.hide();
        obj.error("Only " + allowedDocTypes + " file format allowed.");
        this.commonService.showPopup("Only " + allowedDocTypes + " file format allowed.", 1);
      }
    })
  }




}
