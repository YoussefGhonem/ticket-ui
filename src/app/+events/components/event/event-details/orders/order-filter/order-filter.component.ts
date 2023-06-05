import { Options } from '@angular-slider/ngx-slider';
import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { SortOptionsEnum } from '@shared/models/BaseModels/enums';
import { TicketTypesController } from 'app/+events/controllers';
import { EventAllowedActions } from 'app/+events/models';
import { EventService } from 'app/core/services/event.service';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'order-filters',
  templateUrl: './order-filter.component.html',
  styleUrls: ['./order-filter.component.scss']
})
export class OrderFilterComponent extends BaseComponent implements OnInit {

  eventId: string;
  public dropdownOpen: boolean = false;
  form: FormGroup;
  ticketTypes: any[];
  eventAllowedAction = EventAllowedActions;

  @Output('export') export = new EventEmitter<object>();

  @Output('loadOrders') loadOrders = new EventEmitter<object>();
  @ViewChild('openAgain') openAgain: ElementRef;
  @ViewChild('closeAgain') closeAgain: ElementRef;
  @ViewChild('toggle') toggle: ElementRef;


  testBoolean: boolean = false;

  priceValue = 0;
  pricehighValue = 1000000;


  ticketPriceOptions: Options = {
    floor: 0,
    ceil: 1000000
  };


  constructor(
    public override injector: Injector,
    private _formBuilder: FormBuilder,
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
    this.initSearchForm();
    this.getTicketTypesDropdown();
    this.searchWithoutToggle();
  }

  getEventIdFromQuery() {
    this.router.paramMap
      .subscribe(params => {
        console.log(params);
        this.eventId = params.get('id');
      });
  }

  getTicketTypesDropdown() {
    this.httpService.GET(TicketTypesController.GetTicketTypesNeedApprovalDropdown(this.eventId))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.ticketTypes = res;
      })
  }

  private initSearchForm(): void {
    this.form = this._formBuilder.group({
      // Pagination
      pageNumber: new FormControl(1),
      pageSize: new FormControl(10),
      //filters
      searchWord: new FormControl(null),
      purchaseDateFrom: new FormControl(null),
      purchaseDateTo: new FormControl(null),
      ticketTypeId: new FormControl(null),
      totalPriceFrom: new FormControl(this.priceValue),
      totalPriceTo: new FormControl(this.pricehighValue),
      sortField: new FormControl(null),
      sortOrder: new FormControl(SortOptionsEnum.Ascending),
      columns: [],
      currentTimeZoneDifferenceInMinutes: new FormControl((new Date()).getTimezoneOffset())
    });

    this.form.get('searchWord').valueChanges
    .pipe(debounceTime(500))
    .subscribe(res => {
      this.searchWithoutToggle();
    })

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
    this.form.controls['searchWord'].reset();
  }

  chowDeleteIcon() {
    if(this.form.get('searchWord').value == null) return false;
    if(this.form.get('searchWord').value != '') return true;

    return false;
  }

  

  clear() {
    this.form.reset();
    this.priceValue = 0;
    this.pricehighValue = 1000000;
    this.form.controls['totalPriceFrom'].patchValue(this.priceValue);
    this.form.controls['totalPriceTo'].patchValue(this.pricehighValue);
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.form.controls['currentTimeZoneDifferenceInMinutes'].patchValue((new Date()).getTimezoneOffset());
    this.searchWithoutToggle();
  }

  getBody() {
    let filters = this.form.getRawValue();
    let range = filters.purchaseDateFrom;
    filters.purchaseDateFrom = range?.from.toUTCString();
    filters.purchaseDateTo = range?.to.toUTCString();
    console.log(filters);
    return filters;
  }

  search() {
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    // this.notify.emit()
    this.loadOrders.emit(this.getBody());
    this.toggleSearch();
  }

  searchWithoutToggle() {
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    // this.notify.emit()
    this.loadOrders.emit(this.getBody());
  }

  changePriceSlider(event: any, type: string) {
    if (type == 'min') {
      this.priceValue = event.target.value;
    } else {
      this.pricehighValue = event.target.value;
    }
  }

  exportData(){
    console.log("hi");
    this.export.emit(this.getBody());
  }

}
