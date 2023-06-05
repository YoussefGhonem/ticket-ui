import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';

@Component({
  selector: 'receipt-header',
  templateUrl: './receipt-header.component.html',
  styleUrls: ['./receipt-header.component.scss']
})
export class ReceiptHeaderComponent extends BaseComponent implements OnInit {
  constructor(
      public override injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
