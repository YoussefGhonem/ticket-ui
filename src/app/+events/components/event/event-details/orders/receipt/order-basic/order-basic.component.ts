import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';

@Component({
  selector: 'order-basic-info',
  templateUrl: './order-basic.component.html',
  styleUrls: ['./order-basic.component.scss']
})
export class OrderBasicInfoComponent extends BaseComponent implements OnInit {
  constructor(
      public override injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
