import { BaseComponent } from '@shared/base/base.component';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { SimplebarAngularComponent } from 'simplebar-angular';

@Component({
  selector: 'app-event-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})

export class EventActivitiesComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit {

  @Input('eventActivities') eventActivities: any[] = [];
  @Output('loadActivities') loadActivities = new EventEmitter<object>();
  @Output('firstTime') firstTime = new EventEmitter<object>();

  form: FormGroup;

  public dropdownOpen: boolean = false;
  @ViewChild('openAgain') openAgain: ElementRef;
  @ViewChild('closeAgain') closeAgain: ElementRef;
  @ViewChild('toggle') toggle: ElementRef;
  @ViewChild('cardBody') body: SimplebarAngularComponent;
  @ViewChild('audits') auditComponent: ElementRef;
  testBoolean: boolean = false;

  @Input('currentPage') currentPage: number = 1;

  constructor(
    public override injector: Injector, private _formBuilder: FormBuilder) {
    super(injector);
  }
  ngAfterViewInit(): void {
    (this.body).SimpleBar.getScrollElement().addEventListener('scroll', (e) => {
      let scrollBottom = e.target.scrollTop + e.target.clientHeight;
      console.log(scrollBottom)
      let currentHeight = e.target.scrollHeight;
      console.log(currentHeight)
      let percentage = (scrollBottom/currentHeight) * 100;
      console.log(percentage);
      if(percentage === 100){
        this.form.get('pageNumber').patchValue(this.eventActivities.length > (this.currentPage - 1) * 10 ? ++this.currentPage: this.currentPage);
        let filters = this.getFilters();
        this.loadActivities.emit(filters);
      } 
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.eventActivities);
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.searchWithoutToggle();
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
      this.form.controls['pageNumber'].patchValue(1, {emitEvent: false});
      this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
      this.searchWithoutToggle();
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

  onClick(event){
    if(this.toggle?.nativeElement?.contains(event.target) == false && this.testBoolean)
      if(this.dropdownOpen)
        this.toggleSearch();

    this.testBoolean = true;
  }

  getFilters(): object {
    let filters = this.form.getRawValue();
    let range = filters.from;
    filters.from = range?.from.toUTCString();
    filters.to = range?.to.toUTCString();
    console.log(filters);
    return filters;
  }
  search() {
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    let filters = this.getFilters();
    this.firstTime.emit(filters);
    this.toggleSearch();
  }

  searchWithoutToggle() {
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    let filters = this.getFilters();
    this.firstTime.emit(filters);
  }

  clear() {
    this.initSearchForm();
    let filters = this.getFilters();
    this.firstTime.emit(filters);
  }

  getHeight(element: any): number {
    return window.innerHeight - element?.getBoundingClientRect().top - 180;
  }

}
