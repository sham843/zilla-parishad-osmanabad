import { Pipe, PipeTransform } from '@angular/core';
import { WebStorageService } from '../services/web-storage.service';

@Pipe({
  name: 'numberTranformPipe',
  standalone: true
})

export class NumberTransformPipe implements PipeTransform {
  numFormat: any;

  constructor(private webStorage: WebStorageService){
  }

  //Marathi number transform
  transform(value: any) {
      let number = this.webStorage.numberTransformFunction(value);        
      return number
  }
  
}