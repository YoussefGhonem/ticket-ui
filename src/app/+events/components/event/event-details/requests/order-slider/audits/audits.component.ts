import { BaseComponent } from '@shared/base/base.component';
import { AfterViewInit, Component, ElementRef, Injector, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { EventRequestsController } from 'app/+events/controllers';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { SimplebarAngularComponent } from 'simplebar-angular';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'request-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.scss']
})


export class RequestAuditsComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit {

@Input('request') request: any;
  audits: any[] = [];
  @ViewChild('cardBody') body: SimplebarAngularComponent;
  form: FormGroup;
  filters: any;

  public dropdownOpen: boolean = false;
  @ViewChild('openAgain') openAgain: ElementRef;
  @ViewChild('closeAgain') closeAgain: ElementRef;
  @ViewChild('toggle') toggle: ElementRef;
  testBoolean: boolean = false;

  currentPage: number = 1;

  constructor(
    public override injector: Injector,
    private _formBuilder: FormBuilder
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    this.initSearchForm();
    this.loadAudits(this.getFilters());
  }

  private initSearchForm(): void {
    this.form = this._formBuilder.group({
      // Pagination
      pageNumber: new FormControl(1),
      pageSize: new FormControl(10),
      //filters
      title: new FormControl(null),
      from: new FormControl(null),
      to: new FormControl(null),
    });
    this.form?.controls['title']?.valueChanges
      .pipe(debounceTime(500))
      .subscribe(res => {
        this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
        this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
        this.loadAudits(this.getFilters());
      });
  }

  
  clearSearchBar() {
    this.form.get('title').reset();
  }
  chowDeleteIcon() {
    if(this.form.get('title').value == null) return false;
    if(this.form.get('title').value != '') return true;

    return false;
  }


  ngAfterViewInit(): void {
    (this.body).SimpleBar.getScrollElement().addEventListener('scroll', (e) => {
      let scrollBottom = e.target.scrollTop + e.target.clientHeight;
      console.log(scrollBottom)
      let currentHeight = e.target.scrollHeight;
      console.log(currentHeight)
      let percentage = (scrollBottom / currentHeight) * 100;
      console.log(percentage);
      if (percentage === 100) {
        this.form.get('pageNumber').patchValue(this.audits.length > (this.currentPage - 1) * 10 ? ++this.currentPage: this.currentPage);
        let filters = this.getFilters();
        this.loadAudits(filters);
      }
    })
  }


  isExpandable(item: any) {
    return item.extraInfo.hasDescription;
  }

  loadAudits(filter: any = null) {
    this.filters = filter ?? this.filters;
    this.httpService.GET(EventRequestsController.GetRequestAudits(this.request?.requestId), this.filters)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
        this.audits = res.data;
        console.log(this.audits)
    })
  }

  loadAuditsWithToggle(filter: any = null) {
    this.filters = filter ?? this.filters;
    this.httpService.GET(EventRequestsController.GetRequestAudits(this.request?.requestId), this.filters)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
        this.audits = res.data;
        console.log(this.audits);
        this.toggleSearch();
    });
  }

  search() {
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.loadAuditsWithToggle(this.getFilters())
  }

  getFilters(): object {
    let filters = this.form.getRawValue();
    let range = filters.from;
    filters.from = range?.from.toUTCString();
    filters.to = range?.to.toUTCString();
    console.log(filters);
    return filters;
  }

  getHeight(element: any): number {
    return window.innerHeight - element?.getBoundingClientRect().top - 180;
  }

  toggleSearch() {
    if (!this.dropdownOpen) {
      console.log("hello");
      this.dropdownOpen = true;
      document.querySelector<HTMLElement>(".dropdown-list-audits").style.display = "block";
    } else {
      this.dropdownOpen = false;
      document.querySelector<HTMLElement>(".dropdown-list-audits").style.display = "none";
      console.log("none");
    }
    this.testBoolean = false;
  }

  onClick(event){
    if(this.toggle?.nativeElement?.contains(event.target) == false && this.testBoolean)
      if(this.dropdownOpen)
        this.toggleSearch();

    this.testBoolean = true;
  }

  clear() {
    this.initSearchForm();
    let filters = this.getFilters();
    this.loadAudits(filters);
  }

}
