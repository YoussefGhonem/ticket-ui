import { BaseComponent } from '@shared/base/base.component';
import { AfterViewInit, Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SimplebarAngularComponent } from 'simplebar-angular';
import { UsersController } from 'app/+users/controllers';
import { debounceTime } from 'rxjs/operators';
import { EventTypesController } from 'app/+settings/controllers';

@Component({
  selector: 'audits-tab',
  templateUrl: './audit-tab.component.html',
  styleUrls: ['./audit-tab.component.scss']
})

export class AuditsTabComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit {

  @Input('eventTypeAudits') eventTypeAudits: any[] = [];
  @Output('loadFirst') loadFirst = new EventEmitter<object>();
  @Output('load') load = new EventEmitter<object>();
  form: FormGroup;
  currentFilters: any = null;

  public dropdownOpen: boolean = false;
  @ViewChild('openAgain') openAgain: ElementRef;
  @ViewChild('closeAgain') closeAgain: ElementRef;
  @ViewChild('toggle') toggle: ElementRef;
  testBoolean: boolean = false;

  @ViewChild('cardBody') body: SimplebarAngularComponent;
  currentPage: number = 1;

  constructor(
    public override injector: Injector,
    private _formBuilder: FormBuilder
  ) {
    super(injector);
  }
  ngAfterViewInit(): void {
    (this.body).SimpleBar.getScrollElement().addEventListener('scroll', (e) => {
      let scrollBottom = e.target.scrollTop + e.target.clientHeight;
      console.log(scrollBottom)
      let currentHeight = e.target.scrollHeight;
      console.log(currentHeight)
      let percentage = (scrollBottom / currentHeight) * 100;
      console.log(percentage);
      if (percentage >= 100) {
        this.form.get('pageNumber').patchValue(this.eventTypeAudits.length > (this.currentPage - 1) * 10 ? ++this.currentPage: this.currentPage);
        let filters = this.getFilters();
        this.load.emit(filters);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.loadFirst.emit(this.getFilters());
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
        this.searchWithoutToggle();
      });
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
    this.toggleSearch();
    this.loadFirst.emit(filters);
  }

  searchWithoutToggle() {
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    let filters = this.getFilters();
    this.loadFirst.emit(filters);
  }

  clear() {
    this.initSearchForm();
    let filters = this.getFilters();
    this.loadFirst.emit(filters);
  }

  getHeight(element: any): number {
    return window.innerHeight - element?.getBoundingClientRect().top - 180;
  }
}
