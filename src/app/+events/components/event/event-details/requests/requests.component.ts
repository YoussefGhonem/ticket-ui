import { NgbActiveModal, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from './../../../../../core/services/event.service';
import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from "@angular/core";
import { TableDataAdapterService } from '@libs/primeng-table/services/table-data-adapter.service';
import { TableColumn } from '@libs/primeng-table/models/table-column.model';
import { EventRequestsController } from 'app/+events/controllers';
import { ActivatedRoute } from '@angular/router';
import { EventAllowedActions, RequestAllowedActions, RequestStatus } from 'app/+events/models';
import { RejectRequestsComponent } from './reject-request/reject-request.component';
import { ngbModalOptions } from '@shared/default-values';
import { SortOptionsEnum } from '@libs/primeng-table/models/enums';
import { ApproveRequestsComponent } from './approve-requests/approve-requests.component';
import { debounceTime, takeUntil } from 'rxjs/operators';
import * as saveAs from 'file-saver';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-event-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})

export class EventRequestsComponent extends BaseComponent implements OnInit, OnChanges {

  @Input('eventBasicInfo') eventBasicInfo: any;
  columns: TableColumn<any>[] = [];
  eventId: string;
  filters: object = null;
  eventAllowedActions = EventAllowedActions;
  requestStatus = RequestStatus;
  requestAllowedActions = RequestAllowedActions;
  chosenRequest: any;

  myEvent: any = null;

  form: FormGroup;

  checkedRows: any[] = [];

  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private _formBuilder: FormBuilder,
      public override injector: Injector, public tableService: TableDataAdapterService,
      private eventService: EventService, private router: ActivatedRoute,
      private offcanvasService: NgbOffcanvas
  ) {
    super(injector);
    this.columns = [
      { title: 'Customer', field: 'name', type: 'custom', visible: true, allowSorting: true },
      { title: 'Request Ref', field: 'reference', type: 'text', visible: true, allowSorting: true },
      { title: 'Status', field: 'status', type: 'custom', visible: true, allowSorting: true },
      { title: 'Request Date', field: 'requestDate', type: 'datetime', visible: true, allowSorting: true },
      { title: 'Ticket Type', field: 'title', type: 'text', visible: true, allowSorting: true },
      { title: 'Requested', field: 'quantity', type: 'number', visible: true, allowSorting: true },
      { title: 'Available', field: 'availableTickets', type: 'number', visible: true, allowSorting: true },
      { title: 'Approved', field: 'currentApprovedQuantity', type: 'number', visible: true, allowSorting: true },
      { title: 'Total Price', field: 'totalPrice', type: 'number', visible: true, allowSorting: true },
      { title: 'Actions', field: 'actions', type: 'custom', visible: true, allowSorting: false }
    ];

    let firstColumn: TableColumn<any>[] = [{ title: 'Select', field: 'checkBox', type: 'custom', visible: true, allowSorting: false }];
    let lastColumn: TableColumn<any>[] = [];
    this.columns = this.userHasPermission() ? firstColumn.concat(this.columns).concat(lastColumn) : this.columns;

    this.router.paramMap
    .subscribe(params => {
      console.log(params);
      this.eventId = params.get('id');
    });
  }

  userHasPermission(): boolean {
    return this.currentUser.roles.includes('Vendor') || this.currentUser.roles.includes('VendorAdmin') || this.currentUser.roles.includes('CommitteeMember');
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.initSearchForm();
  }

  private initSearchForm(): void {
    this.form = this._formBuilder.group({
      // Pagination
      pageNumber: new FormControl(1),
      pageSize: new FormControl(10),
      //filters
      name: new FormControl(null),
      requestDateFrom: new FormControl(null),
      requestDateTo: new FormControl(null),
      status: new FormControl(1),
      ticketTypeId: new FormControl('null'),
      totalPriceFrom: new FormControl(0),
      totalPriceTo: new FormControl(1000000),
      sortField: new FormControl(null),
      sortOrder: new FormControl(SortOptionsEnum.Ascending),
      columns: [],
      currentTimeZoneDifferenceInMinutes: new FormControl((new Date()).getTimezoneOffset())
    });

    this.form.get('name').valueChanges
    .pipe(debounceTime(500))
    .subscribe(res => {
      this.loadRequests(this.getBody());
    });

    this.form.controls['pageNumber'].valueChanges
    .subscribe(res => {
      this.checkedRows = [];
      console.log("hello");
    })

    this.form.get('pageSize').valueChanges
    .subscribe(res => {
      this.checkedRows = [];
    })

    this.form.get('sortField').valueChanges
    .subscribe(res => {
      this.checkedRows = [];
    })

    this.form.get('sortOrder').valueChanges
    .subscribe(res => {
      this.checkedRows = [];
    })
  }

  getBody() {
    let filters = this.form.getRawValue();
    let range = filters.requestDateFrom;
    filters.requestDateFrom = range?.from.toUTCString();
    filters.requestDateTo = range?.to.toUTCString();
    filters.ticketTypeId = filters.ticketTypeId == 'null' ? null : filters.ticketTypeId;
    console.log(filters);
    return filters;
  }

  loadRequests(filters: object = null) {
    console.log(filters);
    if(this.filters == null){
      console.log(this.form);
      this.tableService.setupTable(EventRequestsController.GetEventRequests(this.eventId), this.columns, filters, this.form);
      this.filters = filters ?? this.filters;
      this.checkedRows = [];
    }
    else{
      this.filters = filters ?? this.filters;
      this.tableService.loadData(this.filters).subscribe();
      this.checkedRows = [];
    }
  }

  openOrderSlider(content: TemplateRef<any>, item: any) {
    this.chosenRequest = item;
    console.log(this.chosenRequest);
    this.offcanvasService.open(content, { position: 'end' });
  }

  initCheckedRows() {
    this.checkedRows = [];
    console.log(this.checkedRows);
  }

  fire(event: any) {
    console.log(event);
    this.tableService.selectedColumns = (event as TableColumn<any>[]);
    console.log(this.tableService.selectedColumns);
  }

  eventHasAllowedAction(action: EventAllowedActions): boolean {
    return this.eventBasicInfo?.allowedActions?.includes(action);
  }

  requestAllowedAction(item: any, action: RequestAllowedActions): boolean {
    return item?.allowedActions?.includes(action);
  }

  patchChecked(rowData): boolean {
    return this.checkedRows.includes(rowData);
  }

  onCheckBoxChange(row: any, event) {
    if(this.checkedRows.includes(row)){
      let index = this.checkedRows.indexOf(row);
      this.checkedRows.splice(index, 1);
      console.log(this.checkedRows);
    }
    else{
      this.checkedRows.push(row);
      console.log(this.checkedRows);
    }
  }

  selectAll(event) {
    this.myEvent = event;
    if(event.target.checked){
      this.tableService.data.forEach(x => {
        if(this.checkedRows.includes(x) == false){
          this.checkedRows.push(x);
        }
      })
    }
    else {
      this.initCheckedRows();
    }
  }

  reject(requests: any[], offcanvas: any = null) {
    const modalRef = this.modalService.open(RejectRequestsComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-danger'
    });
    modalRef.componentInstance.title = 'requests';
    modalRef.componentInstance.requests = requests;
    modalRef.componentInstance.url = EventRequestsController.Reject(this.eventId);
    modalRef.componentInstance.reason = true;
    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if(actionCompleted) {
          this.activeModal.close(true)
          this.tableService.loadData(undefined, true).subscribe();
          if(this.myEvent != null) {
            this.myEvent.target.checked = !this.myEvent.target.checked;
            this.myEvent = null;
          }
          this.checkedRows = [];
          if(offcanvas != null)
            offcanvas.dismiss('Cross click');
        }
      })
      .catch(() => {
      });
  }

  approve(requests: any[], offcanvas: any = null) {
    console.log(requests);
    const modalRef = this.modalService.open(ApproveRequestsComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-success',
      size: 'lg'
    });
    modalRef.componentInstance.title = 'requests';
    modalRef.componentInstance.requests = requests;
    modalRef.componentInstance.eventId = this.eventId;
    modalRef.componentInstance.url = EventRequestsController.Approve(this.eventId);
    modalRef.componentInstance.reason = false;
    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if(actionCompleted) {
          this.activeModal.close(true)
          this.tableService.loadData(undefined, true).subscribe();
          if(this.myEvent != null) {
            this.myEvent.target.checked = !this.myEvent.target.checked;
            this.myEvent = null;
          }
          this.checkedRows = [];
          if(offcanvas != null)
            offcanvas.dismiss('Cross click');
        }
      })
      .catch(() => {
      });
  }

  
  export(filters: any) {
    console.log(filters);
    let columns = this.tableService?.selectedColumns?.filter(x => x.visible && x.field != 'actions' && x.field != 'checkBox').map(x => x.field);
    filters.columns = columns;
    let fileName = 'Requests';
    const result = fileName.replace(/([A-Z])/g, " $1");
    fileName = result.charAt(0).toUpperCase() + result.slice(1);

    this.httpService.ExportExcel(EventRequestsController.ExportToExcel(this.eventId), filters)
      .pipe(takeUntil(this.ngUnsubscribe))
      .toPromise()
      .then((data: any) => {
        saveAs(data, `${fileName.trim()}.xlsx`);
      });
  }

}
