import { SortOptionsEnum } from './../../../../../../@shared/models/BaseModels/enums';
import { EventAllowedActions, TicketTypeModel, TicketTypeSortEnum } from './../../../../models';
import { takeUntil } from 'rxjs/operators';
import { EventsController, TicketTypesController } from 'app/+events/controllers';
import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Injector, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, UntypedFormBuilder } from "@angular/forms";
import { BaseComponent } from "@shared/base/base.component";
import { SettingsController } from 'app/+settings/controllers';
import { ComplementaryTicketController } from 'app/+events/controllers/ComplementaryTicketController';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ngbModalOptions } from '@shared/default-values';
import { UpdateMaxCapacityComponent } from './update-event-max-capacity/update-event-max-capacity.component';

@Component({
  selector: "app-event-tickets",
  templateUrl: "./tickets.component.html",
  styleUrls: ["./tickets.component.scss"],
})
export class EventTicketsComponent extends BaseComponent implements OnInit {
  @Input() eventAllowedActions: EventAllowedActions[];
  @Input('eventBasicInfo') eventBasicInfo: any;
  @Output() loadEvent = new EventEmitter();
  @Output('loadActivities') loadActivities = new EventEmitter();

  allowedActions = EventAllowedActions;

  form: FormGroup;
  eventId: string;
  percentage: number;
  ticketTypes: TicketTypeModel[] = null;
  complementaryTicket: TicketTypeModel = null;
  total: number;
  maxCapacity: number | null;

  constructor(
    public override injector: Injector,
    private router: ActivatedRoute,
    private _formBuilder: UntypedFormBuilder,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal
  ) {
    super(injector);
  }

  hasAllowedAction(action: EventAllowedActions): boolean {
    let allowedActions = this.eventAllowedActions as Array<EventAllowedActions>
    return allowedActions?.includes(action);
  }

  ngOnInit(): void {
    this.getEventIdFromQuery();
    this.initSearchForm();
    this.loadTicketTypes();
    this.loadComplementary();
    this.loadPercentage();
  }

  getEventIdFromQuery() {
    this.router.paramMap
      .subscribe(params => {
        this.eventId = params.get('id');
      });
  }

  loadPercentage() {
    this.httpService.GET(SettingsController.GetTicketFees)
      .subscribe(res => {
        this.percentage = res;
      })
  }

  loadComplementary() {
    this.httpService.GET(ComplementaryTicketController.GetComplementaryTicket(this.eventId))
      .subscribe(res => {
        this.complementaryTicket = res;
      })
  }

  loadActivitiesEvent() {
    this.loadActivities.emit();
  }

  loadEventDetails() {
    this.loadEvent.emit();
  }

  loadTicketTypes() {
    let filters = this.form.getRawValue();
    let range = filters.createdDateFrom;
    filters.createdDateFrom = range?.from.toUTCString();
    filters.createdDateTo = range?.to.toUTCString();
    console.log(filters);

    this.httpService.GET(TicketTypesController.GetTicketTypes(this.eventId), filters)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.ticketTypes = res?.ticketTypes?.data;
        this.maxCapacity = res?.maxCapacity;
        this.total = res?.ticketTypes?.total;
        this.loadEvent.emit();
        console.log(res);
      });
  }


  private initSearchForm(): void {
    this.form = this._formBuilder.group({
      // Pagination
      pageNumber: new FormControl(1),
      pageSize: new FormControl(10),
      //filters
      title: new FormControl(null),
      createdDateFrom: new FormControl(null),
      createdDateTo: new FormControl(null),
      minPrice: new FormControl(0),
      maxPrice: new FormControl(10000000),
      minPurchasedTicket: new FormControl(0),
      maxPurchasedTicket: new FormControl(10000000),
      sortField: new FormControl(null),
      sortOrder: new FormControl(SortOptionsEnum.Ascending)
    });

  }

  pageChange(pageNumber: number) {
    this.form.controls['pageNumber'].patchValue(pageNumber, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.loadTicketTypes();
  }

  onClickAdjustMaxCapacity() {
    const modalRef = this.modalService.open(UpdateMaxCapacityComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-primary',
      size: 'md'
    });
    console.log(this.maxCapacity);
    modalRef.componentInstance.eventId = this.eventId;
    modalRef.componentInstance.maxCapacity = this.maxCapacity;
    modalRef.componentInstance.eventStatus = this.eventBasicInfo?.status;
    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.loadTicketTypes();
          this.loadEvent.emit();
          this.activeModal.close(true);
        }
      })
      .catch(() => {
      });
  }
}
