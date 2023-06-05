import { NgbActiveModal, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SortOptionsEnum } from '@shared/models/BaseModels/enums';
import { EventAllowedActions } from 'app/+events/models';
import { Options } from '@angular-slider/ngx-slider';
import { EventRequestsController, TicketTypesController } from 'app/+events/controllers';
import { debounceTime, takeUntil } from 'rxjs/operators';
import * as saveAs from 'file-saver';

@Component({
  selector: 'requests-filter',
  templateUrl: './requests-filter.component.html',
  styleUrls: ['./requests-filter.component.scss']
})

export class RequestsFilterComponent extends BaseComponent implements OnInit, OnChanges {

eventId: string;
public dropdownOpen: boolean = false;
@Input('form') form: FormGroup;
ticketTypes: any[] = [{title: 'All', id: 'null'}];


@Input('checkedRows') checkedRows: any[] = [];
@Output('loadRequests') loadRequests = new EventEmitter<object>();
@Output('reject') reject = new EventEmitter<any[]>();
@Output('approve') approve = new EventEmitter<any[]>();
@Output('export') export = new EventEmitter<object>();
@Output('initCheckedRows') initCheckedRows = new EventEmitter();

eventAllowedAction = EventAllowedActions;

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
    // this.initSearchForm();
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
        this.ticketTypes = this.ticketTypes.concat(res);
    })
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
      totalPriceFrom: new FormControl(this.priceValue),
      totalPriceTo: new FormControl(this.pricehighValue),
      sortField: new FormControl(null),
      sortOrder: new FormControl(SortOptionsEnum.Ascending),
      columns: [],
      currentTimeZoneDifferenceInMinutes: new FormControl((new Date()).getTimezoneOffset())
    });

    this.form.get('name').valueChanges
    .pipe(debounceTime(500))
    .subscribe(res => {
      this.searchWithoutToggle();
    });

    this.form.controls['pageNumber'].valueChanges
    .subscribe(res => {
      this.initCheckedRows.emit();
      this.checkedRows = [];
    })

    this.form.get('pageSize').valueChanges
    .subscribe(res => {
      this.initCheckedRows.emit();
      this.checkedRows = [];
    })

    this.form.get('sortField').valueChanges
    .subscribe(res => {
      this.initCheckedRows.emit();
      this.checkedRows = [];
    })

    this.form.get('sortOrder').valueChanges
    .subscribe(res => {
      this.initCheckedRows.emit();
      this.checkedRows = [];
    })
  }

  clearSearchBar() {
    this.form.get('name').reset();
  }
  chowDeleteIcon() {
    if(this.form.get('name').value == null) return false;
    if(this.form.get('name').value != '') return true;

    return false;
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

  clearCreatedDate() {
    this.form.controls['requestDateFrom'].reset();
  }

  clear() {
    this.form.reset();
    this.priceValue = 0;
    this.pricehighValue = 1000000;
    this.form.controls['totalPriceFrom'].patchValue(this.priceValue);
    this.form.controls['totalPriceTo'].patchValue(this.pricehighValue);
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.form.controls['currentTimeZoneDifferenceInMinutes'].patchValue((new Date()).getTimezoneOffset())
    this.form.controls['requestDateFrom'].patchValue(null);
    this.form.controls['requestDateTo'].patchValue(null);
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

  changeForm() {
    this.form.controls['totalPriceFrom'].patchValue(this.priceValue);
    this.form.controls['totalPriceTo'].patchValue(this.pricehighValue);
    console.log("hi");
  }
  search() {
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    // this.notify.emit()
    this.loadRequests.emit(this.getBody());
    this.toggleSearch();
  }

  searchWithoutToggle() {
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    // this.notify.emit()
    this.loadRequests.emit(this.getBody());
  }

  hasAllowedAction(action: EventAllowedActions) {
    return true;
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
