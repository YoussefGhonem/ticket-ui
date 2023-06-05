import { Component, Injector, Input, OnInit, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { EventOrdersController } from 'app/+events/controllers';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'request-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class RequestOrdersComponent extends BaseComponent implements OnInit {

    @Input('request') request: any;
    chosenOrder: any;

    requestOrders: any[] = [];
  constructor(
      public override injector: Injector,
      private offcanvasService: NgbOffcanvas
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadRequestOrders();
  }

  loadRequestOrders() {
    this.httpService.GET(EventOrdersController.GetOrdersPerRequest(this.request?.requestId))
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
        this.requestOrders = res;
    });
  }

  openOrderSlider(content: TemplateRef<any>, id: string) {
    this.httpService.GET(EventOrdersController.GetOrderById(id))
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
        this.chosenOrder = res;
        console.log(this.chosenOrder);
        this.offcanvasService.open(content, { position: 'end' });
    })
  }

}
