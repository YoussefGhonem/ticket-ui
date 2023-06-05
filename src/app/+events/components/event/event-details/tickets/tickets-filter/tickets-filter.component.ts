import { TicketTypesSort } from './../../../../../models/constant';
import { SortModel } from './../../../../../../../@libs/primeng-table/models/sort-object.model';
import { TicketTypeSortEnum } from './../../../../../models/enum';
import { AddComplementaryTicketComponent } from './../add-complementary-ticket/add-complementary-ticket.component';
import { EventAllowedActions } from 'app/+events/models';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { SettingsController } from 'app/+settings/controllers';
import { AddTicketTypeComponent } from './../add-ticket-type/add-ticket-type.component';
import { BaseComponent } from "@shared/base/base.component";
import { Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Options } from "@angular-slider/ngx-slider";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ngbModalOptions } from '@shared/default-values';
import { SortOptionsEnum } from '@libs/primeng-table/models/enums';
import { TicketTypesController } from 'app/+events/controllers';
import * as saveAs from 'file-saver';

@Component({
  selector: "app-event-tickets-filter",
  templateUrl: "./tickets-filter.component.html",
  styleUrls: ["./tickets-filter.component.scss"],
  host: {
    '(document:click)': 'onClick($event)'
  }
})
export class TicketsFilterComponent
  extends BaseComponent
  implements OnInit, OnChanges {

  public dropdownOpen: boolean = false;
  @Input("form") form: FormGroup;
  @Input('eventAllowedActions') eventAllowedActions: EventAllowedActions[];
  eventAllowedAction = EventAllowedActions;
  @Output('notify') notify = new EventEmitter<boolean>();
  @Output('complementary') complementary = new EventEmitter();
  @Output('loadEvent') loadEvent = new EventEmitter();

  @ViewChild('openAgain') openAgain: ElementRef;
  @ViewChild('closeAgain') closeAgain: ElementRef;
  @ViewChild('toggle') toggle: ElementRef;


  testBoolean: boolean = false;

  ticketSort: SortModel[];
  ticketSortEnum = TicketTypeSortEnum;
  sortedEnum = SortOptionsEnum;

  percentage: number;
  eventId: string;

  priceValue = 0;
  pricehighValue = 10000000;

  purchasedTicketsValue = 0;
  purchasedTicketsHighValue = 1000000;

  ticketPriceOptions: Options = {
    floor: 0,
    ceil: 10000000
  };

  purchasedTicketsOptions: Options = {
    floor: 0,
    ceil: 1000000
  };

  constructor(
    public override injector: Injector,
    private router: ActivatedRoute,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.getEventIdFromQuery();
    this.getTicketSort();
    this.loadPercentage();
    this.initializeForm();
  }

  getEventIdFromQuery() {
    this.router.paramMap
      .subscribe(params => {
        console.log(params);
        this.eventId = params.get('id');
      });
  }

  export() {
    let body = this.form.getRawValue();
    this.httpService.ExportExcel(TicketTypesController.ExportToExcel(this.eventId), body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .toPromise()
      .then((data: any) => {
        saveAs(data, `Ticket Types.xlsx`);
      });
  }
  chowDeleteIcon(): boolean {
    if (this.form.get('title').value == null) return false
    else if (this.form.get('title').value?.trim().length != 0) return true;
    return false;
  }
  private getTicketSort() {
    this.ticketSort = TicketTypesSort;
  }

  loadPercentage() {
    this.httpService.GET(SettingsController.GetTicketFees)
      .subscribe(res => {
        this.percentage = res;
      })
  }

  initializeForm() {

    this.form?.get('minPrice').patchValue(this.priceValue);
    this.form?.get('maxPrice').patchValue(this.pricehighValue);
    this.form?.get('minPurchasedTicket').patchValue(this.purchasedTicketsValue);
    this.form?.get('maxPurchasedTicket').patchValue(this.purchasedTicketsHighValue);
    this.form?.get('sortOrder').patchValue(SortOptionsEnum.Ascending);

    this.form?.controls['title']?.valueChanges
      .pipe(debounceTime(500))
      .subscribe(res => {
        this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
        this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
        this.notify.emit();
      });

    this.form.controls['sortField'].valueChanges
      .subscribe(res => {
        this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
        this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
        this.notify.emit();

      });

    this.form.controls['sortOrder'].valueChanges
      .subscribe(res => {
        this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
        this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
        if (this.form.getRawValue().sortField != null) this.notify.emit();
      });
  }

  onSortChanges(sortedEnum: SortOptionsEnum) {
    this.form.controls['sortOrder'].patchValue(sortedEnum)
    console.log(this.form.getRawValue().sortOrder);
  }


  toggleSearch() {
    if (!this.dropdownOpen) {
      console.log("hello");
      this.dropdownOpen = true;
      document.querySelector<HTMLElement>(".dropdown-list").style.display = "block";
    } else {
      this.dropdownOpen = false;
      document.querySelector<HTMLElement>(".dropdown-list").style.display = "none";
      console.log("none");
    }
    this.testBoolean = false;
  }

  onClick(event) {
    if (this.toggle?.nativeElement?.contains(event.target) == false && this.testBoolean)
      if (this.dropdownOpen)
        this.toggleSearch();

    this.testBoolean = true;
  }

  clearSearchBar() {
    this.form.controls['title'].reset();
  }

  search() {
    this.form.get('minPrice').patchValue(this.priceValue);
    this.form.get('maxPrice').patchValue(this.pricehighValue);
    this.form.get('minPurchasedTicket').patchValue(this.purchasedTicketsValue);
    this.form.get('maxPurchasedTicket').patchValue(this.purchasedTicketsHighValue);
    this.notify.emit(true);
    this.toggleSearch();
  }

  clear() {
    let priceValue = 0;
    this.priceValue = priceValue
    let pricehighValue = 10000000;
    this.pricehighValue = pricehighValue
    let purchasedTicketsValue = 0;
    this.purchasedTicketsValue = purchasedTicketsValue
    let purchasedTicketsHighValue = 10000000;
    this.purchasedTicketsHighValue = purchasedTicketsHighValue

    this.form?.get('minPrice').patchValue(priceValue);
    this.form?.get('maxPrice').patchValue(pricehighValue);
    this.form?.get('minPurchasedTicket').patchValue(purchasedTicketsValue);
    this.form?.get('maxPurchasedTicket').patchValue(purchasedTicketsHighValue);
    this.form.controls['createdDateFrom'].reset()
    this.notify.emit(true);
  }

  changePriceSlider(event: any, type: string) {
    if (type == 'min') {
      this.priceValue = event.target.value;
    } else {
      this.pricehighValue = event.target.value;
    }
  }

  changeTicketSlider(event: any, type: string) {
    if (type == 'min') {
      this.purchasedTicketsValue = event.target.value;
    } else {
      this.purchasedTicketsHighValue = event.target.value;
    }
  }


  addNewTicketType() {
    const modalRef = this.modalService.open(AddTicketTypeComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-primary',
      size: 'md'
    });
    modalRef.componentInstance.percentage = this.percentage;
    modalRef.componentInstance.eventId = this.eventId;

    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.notify.emit(true);
          this.loadEvent.emit();
          this.activeModal.close(true);
        }
      })
      .catch(() => {
      });
  }

  addComplementary() {
    const modalRef = this.modalService.open(AddComplementaryTicketComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-primary',
      size: 'md'
    });
    modalRef.componentInstance.eventId = this.eventId;

    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.complementary.emit();
          this.loadEvent.emit();
          this.activeModal.close(true);
        }
      })
      .catch(() => {
      });
  }

  hasAllowedAction(action: EventAllowedActions) {
    return this.eventAllowedActions?.includes(action);
  }
}
