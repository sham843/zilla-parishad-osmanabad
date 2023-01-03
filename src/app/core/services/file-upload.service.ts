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




}
