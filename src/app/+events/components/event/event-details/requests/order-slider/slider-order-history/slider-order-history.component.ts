import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from "@angular/core";
import { RequestStatus } from 'app/+events/models';

@Component({
  selector: 'slider-order-history',
  templateUrl: './slider-order-history.component.html',
  styleUrls: ['./slider-order-history.component.scss']
})

export class SliderOrderHistoryComponent extends BaseComponent implements OnInit, OnChanges {

  @Input('request') request: any;
  requestStatus = RequestStatus;
  constructor(
      public override injector: Injector,
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }

}
