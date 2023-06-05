import { Component, Injector, Input, OnInit, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { EventOrdersController, EventRequestsController } from 'app/+events/controllers';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'order-items-preview',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.scss']
})
export class OrderItemsPreviewComponent extends BaseComponent implements OnInit {

  @Input('order') order: any;
  selectedOrderItem: any;
  orderItems: any[] = [];
  chosenRequest: any;
  constructor(
      public override injector: Injector,
      private offcanvasService: NgbOffcanvas
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadOrderItems();
  }

  selectOrder(orderItem: any){
    console.log(orderItem);
    this.selectedOrderItem = orderItem;
  }

  loadOrderItems() {
    this.httpService.GET(EventOrdersController.GetOrderItems(this.order?.orderId))
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
        this.orderItems = res;
    })
  }

  openOrderSlider(content: TemplateRef<any>, id: string) {
    this.httpService.GET(EventRequestsController.GetRequestById(id))
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
        this.chosenRequest = res;
        console.log(this.chosenRequest);
        this.offcanvasService.open(content, { position: 'end' });
    })
  }


}
