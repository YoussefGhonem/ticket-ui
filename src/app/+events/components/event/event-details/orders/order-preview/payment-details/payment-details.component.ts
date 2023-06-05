import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';

@Component({
  selector: 'payment-details-preview',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsOrderPreviewComponent extends BaseComponent implements OnInit {

  @Input('order') order: any;
  constructor(
      public override injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
