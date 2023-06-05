import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';

@Component({
  selector: 'customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent extends BaseComponent implements OnInit {
  constructor(
      public override injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
