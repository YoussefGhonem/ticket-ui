import { BaseComponent } from '@shared/base/base.component';
import { AfterViewInit, Component, ElementRef, Injector, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { SettingsController } from 'app/+settings/controllers';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { SimplebarAngularComponent } from 'simplebar-angular';


@Component({
  selector: 'app-settings-audits',
  templateUrl: './settings-audits.component.html',
  styleUrls: ['./settings-audits.component.scss']
})


export class SettingsAuditsComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  settingsActivity: any[] = [];
  form: FormGroup;

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
      let percentage = (scrollBottom/currentHeight) * 100;
      console.log(percentage);
      if(percentage === 100){
        this.form.get('pageNumber').patchValue(this.settingsActivity.length > (this.currentPage - 1) * 10 ? ++this.currentPage: this.currentPage);
        let filters = this.getFilters();
        this.loadSettingsActivities(filters);
      } 
    })
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {

    this.breadCrumbItems = [
      {label: 'Home'},
      {label: 'Settings', active: true},
      {label: 'Audits', active: true}
    ];
    this.initSearchForm();
    this.loadSettingsActivitiesForFirstTime(this.getFilters());
  }

  loadSettingsActivities(filters: any = null): void {
    this.httpService.GET(SettingsController.GetSettingsAudits, filters)
      .subscribe(res => {
      console.log(res);
       this.settingsActivity = res?.data.length == 0 ? this.settingsActivity : this.settingsActivity.concat(res?.data);
      })
  }

  loadSettingsActivitiesForFirstTime(filters: any = null): void {
    this.httpService.GET(SettingsController.GetSettingsAudits, filters)
      .subscribe(res => {
      console.log(res);
       this.settingsActivity = res?.data.length == 0 ? [] : res?.data;
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

  getFilters() {
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
    this.loadSettingsActivitiesForFirstTime(filters);
    this.toggleSearch();
  }

  searchWithoutToggle() {
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    let filters = this.getFilters();
    this.loadSettingsActivitiesForFirstTime(filters);
  }

  clear() {
    this.initSearchForm();
    let filters = this.getFilters();
    this.loadSettingsActivitiesForFirstTime(filters);
  }

  getHeight(element: any): number {
    return window.innerHeight - element?.getBoundingClientRect().top - 180;
  }
}
