import { RolesEnum } from 'app/+auth/models';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { EventsController } from 'app/+events/controllers';
import { SortOptionsEnum } from '@shared/models/BaseModels/enums';
import { User } from 'angular-feather/icons';

@Component({
  selector: 'events-tab',
  templateUrl: './events-tab.component.html',
  styleUrls: ['./events-tab.component.scss']
})
export class EventsTabComponent extends BaseComponent implements OnInit {
  events: any[];
  total: number = 0;
  breadCrumbItems!: Array<{}>;
  form: FormGroup;
  sortedEnum = SortOptionsEnum;
  @Input('user') user:any = null;

  constructor(public activeModal: NgbActiveModal, private router: Router,
    public override injector: Injector,
    private _formBuilder: FormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    console.log(this.user);
    console.log(this.user.id);
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Events', active: true }
    ];

    this.initSearchForm();
    this.loadEvents();
  }

  pageChange(pageNumber: number) {
    this.form.controls['pageNumber'].patchValue(pageNumber, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.loadEvents()
  }

  public loadEvents() {
    let filters = this.form.getRawValue();
    filters.startDate = filters.startDate?.toUTCString();
    filters.endDate = filters.endDate?.toUTCString();

    this.httpService.GET(EventsController.EventsBeVendorId(this.user.businessId), filters)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.events = res?.data;
        this.total = res?.total;
        console.log("this.events", res);
      });
  }

  search() {
    this.loadEvents();
  }

  private initSearchForm(): void {
    this.form = this._formBuilder.group({
      // Pagination
      pageNumber: new FormControl(1),
      pageSize: new FormControl(10),
      //filters
      name: new FormControl(null),
      eventTypeId: new FormControl(null),
      startDate: new FormControl(null),
      endDate: new FormControl(null),
      status: new FormControl(null),
      memberId: new FormControl(null),
      sortField: new FormControl(null),
      sortOrder: new FormControl(this.sortedEnum.Ascending),
      currentTimeZoneDifferenceInMinutes: new FormControl((new Date()).getTimezoneOffset())
    });

    this.form.controls['sortOrder'].patchValue(this.sortedEnum.Ascending);

    this.form.controls['name'].valueChanges
      .pipe(debounceTime(500))
      .subscribe(res => {
        this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
        this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
        this.loadEvents();
      });
    this.form.controls['sortField'].valueChanges
      .subscribe(res => {
        this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
        this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
        this.loadEvents();

      });
    this.form.controls['sortOrder'].valueChanges
      .subscribe(res => {
        this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
        this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
        if (this.form.getRawValue().sortField != null) this.loadEvents();
      });

  }

}
