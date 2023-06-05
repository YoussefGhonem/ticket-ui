import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';

@Component({
  selector: 'order-preview',
  templateUrl: './order-preview.component.html',
  styleUrls: ['./order-preview.component.scss']
})
export class OrderPreviewComponent extends BaseComponent implements OnInit {

  @Input('order') order: any;
  constructor(
      public override injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
