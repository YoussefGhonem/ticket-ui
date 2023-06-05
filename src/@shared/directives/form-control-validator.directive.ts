import { AbstractControl } from '@angular/forms';
import { Directive, ElementRef, HostListener, Input, OnInit } from "@angular/core";

@Directive({
  selector: "[formControlValidator]"
})
export class FormControlValidatorDirective implements OnInit {

  @Input('formControlValidator') abstractControl: AbstractControl;
  private _el: ElementRef;

  private invalidClass = 'is-invalid';

  constructor(el: ElementRef) {
    this._el = el;
  }

  ngOnInit(): void {
    this.updateElementClass();
    this.abstractControl?.valueChanges.subscribe(x => {
      this.updateElementClass();
    });
  }

  @HostListener('focusin', ['$event']) onFocus(event) {
    this.abstractControl?.markAsTouched();
    this.updateElementClass();
  }


  private get isInValid(): boolean {
    return this.abstractControl?.errors && this.abstractControl?.touched;
  }

  private updateElementClass(): void {
    if (this.isInValid) {
      this._el.nativeElement.classList.add(this.invalidClass);
      return;
    }
    this._el.nativeElement.classList.remove(this.invalidClass);
  }

}
