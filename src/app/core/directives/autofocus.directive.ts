import {  Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true
})
export class AutofocusDirective implements OnInit {

  constructor(private elementRef: ElementRef
  ) { }


  ngOnInit() {
    this.elementRef.nativeElement.focus();
  }

}
