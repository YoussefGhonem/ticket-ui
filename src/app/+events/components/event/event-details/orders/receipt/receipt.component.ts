import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';

@Component({
  selector: 'receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent extends BaseComponent implements OnInit {

  @Input('order') order: any;
  constructor(
      public override injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
