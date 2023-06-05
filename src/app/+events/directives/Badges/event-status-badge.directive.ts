import { Directive, ElementRef, Input, OnChanges } from "@angular/core";
import { HumanizePipe } from "@shared/pipes/humanize.pipe";
import { EventStatusEnum } from "app/+events/models/enum";

@Directive({
  selector: "[eventStatusBadge]"
})
export class EventStatusBadgeDirective implements OnChanges {

  @Input('eventStatusBadge') eventStatusBadge: string;
  private readonly _el: ElementRef;

  constructor(el: ElementRef) {
    this._el = el;
  }

  ngOnChanges() {
    if (!this._el || !this.eventStatusBadge) return;

    let cssClass: string = 'secondary';

    switch (this.eventStatusBadge) {
      case EventStatusEnum[EventStatusEnum.Draft]:
        cssClass = 'secondary';
        break;
      case EventStatusEnum[EventStatusEnum.Published]:
        cssClass = 'success';
        break;
      case EventStatusEnum[EventStatusEnum.Ended]:
        cssClass = 'info';
        break;
      case EventStatusEnum[EventStatusEnum.Canceled]:
        cssClass = 'danger';
        break;

    }

    const text = new HumanizePipe().transform(this.eventStatusBadge);
    this._el.nativeElement.innerHTML = `<div class="badge badge-soft-${cssClass} fs-13 text-${cssClass} text-opacity-75">${text}</div>`;
  }

}
