import { BaseComponent } from '@shared/base/base.component';
import { AfterViewInit, Component, ElementRef, Injector, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SimplebarAngularComponent } from 'simplebar-angular';
import { UsersController } from 'app/+users/controllers';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'audits-tab',
  templateUrl: './audits-tab.component.html',
  styleUrls: ['./audits-tab.component.scss']
})

export class AuditsTabComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit {

  @Input('user') user: any = null;

  userAudits: any[] = [];
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
      if (percentage === 100) {
        this.form.get('pageNumber').patchValue(this.userAudits.length > (this.currentPage - 1) * 10 ? ++this.currentPage: this.currentPage);
        let filters = this.getFilters();
        this.loadUsersActivities(filters);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.loadUsersActivitiesForFirstTime(this.getFilters());
  }

  loadUsersActivities(filters: any = null): void {
    this.currentFilters = filters ?? this.currentFilters;
    this.httpService.GET(UsersController.GetUsersAuditsForVendor(this.user.id), this.currentFilters)
      .subscribe(res => {
        console.log(res);
        this.userAudits = res?.data.length == 0 ? this.userAudits : this.userAudits.concat(res?.data);
      })
  }

  loadUsersActivitiesForFirstTime(filters: any = null): void {
    this.httpService.GET(UsersController.GetUsersAuditsForVendor(this.user.id), filters)
      .subscribe(res => {
        console.log(res);
        this.userAudits = res?.data.length == 0 ? [] : res?.data;
      })
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
      document.querySelector<HTMLElement>(".dropdown-list-audits").style.display = "block";
    } else {
      this.dropdownOpen = false;
      document.querySelector<HTMLElement>(".dropdown-list-audits").style.display = "none";
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
    this.loadUsersActivitiesForFirstTime(filters);
    this.toggleSearch();

  }

  searchWithoutToggle() {
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    let filters = this.getFilters();
    this.loadUsersActivitiesForFirstTime(filters);
  }

  clear() {
    this.initSearchForm();
    let filters = this.getFilters();
    this.loadUsersActivitiesForFirstTime(filters);
  }

  getHeight(element: any): number {
    return window.innerHeight - element?.getBoundingClientRect().top - 180;
  }
}
