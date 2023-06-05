import {
  Component,
  Injector,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { SortOptionsEnum } from "@libs/primeng-table/models/enums";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "@shared/base/base.component";
import { EventMembersController, EventsController } from "app/+events/controllers";
import { takeUntil, debounceTime } from "rxjs/operators";

@Component({
  selector: "assigned-events-tab",
  templateUrl: "./assigned-events.component.html",
  styleUrls: ["./assigned-events.component.scss"],
})
export class AssignedEventsComponent
  extends BaseComponent
  implements OnChanges, OnInit
{
  @Input('user') user: any = null;
  events: any[];
  total: number = 0;
  breadCrumbItems!: Array<{}>;
  form: FormGroup;
  sortedEnum = SortOptionsEnum;
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    public override injector: Injector,
    private _formBuilder: FormBuilder
  ) {
    super(injector);
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Home" },
      { label: "Events", active: true },
    ];
    this.initSearchForm();
    this.loadEvents();
  }

  pageChange(pageNumber: number) {
    this.form.controls["pageNumber"].patchValue(pageNumber, {
      emitEvent: false,
    });
    this.form.controls["pageSize"].patchValue(10, { emitEvent: false });
    this.loadEvents();
  }

  public loadEvents() {
    let filters = this.form.getRawValue();
    filters.startDate = filters.startDate?.toUTCString();
    filters.endDate = filters.endDate?.toUTCString();

    this.httpService
      .GET(EventsController.GetAssignedEventsForMember(this.user.id), filters)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
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
      currentTimeZoneDifferenceInMinutes: new FormControl(
        new Date().getTimezoneOffset()
      ),
    });

    this.form.controls["sortOrder"].patchValue(this.sortedEnum.Ascending);

    this.form.controls["name"].valueChanges
      .pipe(debounceTime(500))
      .subscribe((res) => {
        this.form.controls["pageNumber"].patchValue(1, { emitEvent: false });
        this.form.controls["pageSize"].patchValue(10, { emitEvent: false });
        this.loadEvents();
      });
    this.form.controls["sortField"].valueChanges.subscribe((res) => {
      this.form.controls["pageNumber"].patchValue(1, { emitEvent: false });
      this.form.controls["pageSize"].patchValue(10, { emitEvent: false });
      this.loadEvents();
    });
    this.form.controls["sortOrder"].valueChanges.subscribe((res) => {
      this.form.controls["pageNumber"].patchValue(1, { emitEvent: false });
      this.form.controls["pageSize"].patchValue(10, { emitEvent: false });
      if (this.form.getRawValue().sortField != null) this.loadEvents();
    });
  }
}
