import { Component, Injector, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableColumn } from '@libs/primeng-table/models/table-column.model';
import { TableDataAdapterService } from '@libs/primeng-table/services/table-data-adapter.service';
import { NgbActiveModal, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { ngbModalOptions } from '@shared/default-values';
import { EventOrdersController, EventRequestsController } from 'app/+events/controllers';
import { OrdersController } from 'app/+events/controllers/OrdersController';
import { EventAllowedActions, RequestStatus } from 'app/+events/models';
import { EventService } from 'app/core/services/event.service';
import * as saveAs from 'file-saver';
import { takeUntil } from 'rxjs/operators';
import { RejectRequestsComponent } from '../requests/reject-request/reject-request.component';

@Component({
  selector: 'app-event-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class EventOrdersComponent extends BaseComponent implements OnInit, OnChanges {

  columns: TableColumn<any>[] = [];
  eventId: string;
  filters: object = null;
  eventAllowedActions = EventAllowedActions;
  requestStatus = RequestStatus;

  chosenOrder: any;

  checkedRows: any[] = [];

  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public override injector: Injector, public tableService: TableDataAdapterService,
    private eventService: EventService, private router: ActivatedRoute,
    private offcanvasService: NgbOffcanvas
  ) {
    super(injector);
    this.columns = [
      { title: 'Customer', field: 'name', type: 'custom', visible: true, allowSorting: true },
      { title: 'Order Ref', field: 'reference', type: 'custom', visible: true, allowSorting: true },
      { title: 'Purchased Date', field: 'orderDate', type: 'datetime', visible: true, allowSorting: true },
      { title: 'Quantity', field: 'quantity', type: 'number', visible: true, allowSorting: true },
      { title: 'Total Price', field: 'totalPrice', type: 'number', visible: true, allowSorting: true },
      { title: 'Actions', field: 'actions', type: 'custom', visible: true, allowSorting: false },
    ];

    this.router.paramMap
      .subscribe(params => {
        console.log(params);
        this.eventId = params.get('id');
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }

  loadOrders(filters: object = null) {
    console.log(filters);
    if (this.filters == null) {
      this.tableService.setupTable(EventOrdersController.GetOrders(this.eventId), this.columns, filters);
      this.filters = filters ?? this.filters;
    }
    else {
      this.filters = filters ?? this.filters;
      this.tableService.loadData(this.filters).subscribe();
    }
  }

  openOrderSlider(content: TemplateRef<any>, item: any) {
    this.chosenOrder = item;
    this.offcanvasService.open(content, { position: 'end' });
  }

  fire(event: any) {
    console.log(event);
    this.tableService.selectedColumns = (event as TableColumn<any>[]);
    console.log(this.tableService.selectedColumns);
  }

  eventAllowedAction(action: EventAllowedActions): boolean {
    return true;
  }

  patchChecked(rowData): boolean {
    return this.checkedRows.includes(rowData);
  }

  onCheckBoxChange(row: any, event) {
    if (this.checkedRows.includes(row)) {
      let index = this.checkedRows.indexOf(row);
      this.checkedRows.splice(index, 1);
      console.log(this.checkedRows);
    }
    else {
      this.checkedRows.push(row);
      console.log(this.checkedRows);
    }
  }

  export(filters: any) {
    console.log(filters);
    let columns = this.tableService?.selectedColumns?.filter(x => x.visible && x.field != 'actions' && x.field != 'checkBox').map(x => x.field);
    filters.columns = columns;
    let fileName = 'Orders';
    const result = fileName.replace(/([A-Z])/g, " $1");
    fileName = result.charAt(0).toUpperCase() + result.slice(1);

    this.httpService.ExportExcel(EventOrdersController.ExportToExcel(this.eventId), filters)
      .pipe(takeUntil(this.ngUnsubscribe))
      .toPromise()
      .then((data: any) => {
        saveAs(data, `${fileName.trim()}.xlsx`);
      });
  }

}
