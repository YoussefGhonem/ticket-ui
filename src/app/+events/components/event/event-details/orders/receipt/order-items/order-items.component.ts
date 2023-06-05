import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';

@Component({
  selector: 'order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.scss']
})
export class OrderItemsComponent extends BaseComponent implements OnInit {
  constructor(
      public override injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
