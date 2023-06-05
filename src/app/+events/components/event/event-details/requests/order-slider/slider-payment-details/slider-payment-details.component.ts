import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, OnChanges, OnInit, SimpleChanges, TemplateRef } from "@angular/core";

@Component({
  selector: 'slider-payment-details',
  templateUrl: './slider-payment-details.component.html',
  styleUrls: ['./slider-payment-details.component.scss']
})

export class SliderPaymentDetailsComponent extends BaseComponent implements OnInit, OnChanges {

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
