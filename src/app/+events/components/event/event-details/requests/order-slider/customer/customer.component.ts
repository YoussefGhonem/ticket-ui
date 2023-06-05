import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from "@angular/core";

@Component({
  selector: 'slider-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})

export class SliderCustomerComponent extends BaseComponent implements OnInit, OnChanges {
  @Input('request') request: any;

  constructor(
      public override injector: Injector,
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.request);
  }

  ngOnInit(): void {
    console.log(this.request);

  }

}
