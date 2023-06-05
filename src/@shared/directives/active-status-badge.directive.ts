import { Directive, ElementRef, Input, OnChanges } from "@angular/core";

@Directive({
  selector: "[activeStatusBadge]"
})
export class ActiveStatusBadgeDirective implements OnChanges {

  @Input('value') value!: boolean;
  private readonly _el: ElementRef;

  constructor(el: ElementRef) {
    this._el = el;
  }

  iconCssClass?: string;

  ngOnChanges() {
    if (!this._el) return;
    let cssClass: string = 'muted';

    if (!this.value) {
      cssClass = 'muted';
      this.iconCssClass = 'ri-forbid-line'
    } else {
      cssClass = 'success';
      this.iconCssClass = 'ri-checkbox-circle-line'

    }


    this._el.nativeElement.innerHTML = `<div class="text-${cssClass}"><i class="${(this.iconCssClass)} fs-17 align-middle"></i> ${this.value ? 'Active' : 'Inactive'}</div>`;
  }

}
