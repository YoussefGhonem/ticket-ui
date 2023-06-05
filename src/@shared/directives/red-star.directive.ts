import { AbstractControl } from '@angular/forms';
import { Directive, ElementRef, Input, OnInit } from "@angular/core";

@Directive({
  selector: "[redStar]"
})
export class RedStarDirective implements OnInit {

  @Input('redStar') abstractControl: AbstractControl;
  private _el: ElementRef;

  private redStarHtml: string = '<small class="text-danger"> *</small>';

  constructor(el: ElementRef) {
    this._el = el;
  }

  ngOnInit(): void {

    this.isRequired ? this.appendRedStar() : this.removeRedStar();

    this.abstractControl?.valueChanges.subscribe(x => {
      this.isRequired ? this.appendRedStar() : this.removeRedStar();
    });

  }

  private get isRequired(): boolean {
    if (this.abstractControl?.validator === null) return false;
    return this.abstractControl?.validator({} as AbstractControl)?.hasOwnProperty('required');
  }

  private appendRedStar(): void {
    const redStarNotExist = !this._el.nativeElement.innerHTML?.includes(this.redStarHtml);
    if (this.isRequired && redStarNotExist) this._el.nativeElement.innerHTML += this.redStarHtml;
  }

  private removeRedStar(): void {
    const redStarExist = this._el.nativeElement.innerHTML?.includes(this.redStarHtml);
    if (!this.isRequired && redStarExist) this._el.nativeElement.innerHTML = this._el.nativeElement.innerHTML?.replace(this.redStarHtml, '');
  }

}
