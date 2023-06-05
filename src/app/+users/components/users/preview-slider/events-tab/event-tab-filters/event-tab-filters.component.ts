import { EventSortEnum, EventStatusEnum } from 'app/+events/models/enum';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';
import { EventTypesController } from 'app/+settings/controllers';
import { MembersController } from 'app/+vendors/controllers';
import { SortOptionsEnum } from '@libs/primeng-table/models/enums';
import { EventsController } from 'app/+events/controllers';
import { takeUntil } from 'rxjs/operators';
import * as saveAs from 'file-saver';

@Component({
  selector: 'event-tab-filters',
  templateUrl: './event-tab-filters.component.html',
  styleUrls: ['./event-tab-filters.component.scss'],
  host: {
    '(document:click)': 'onClick($event)'
  }
})
export class EventTabFiltersComponent extends BaseComponent implements OnInit {
  public dropdownOpen: boolean = false;
  @Input('form') form: FormGroup;
  @Input('events') events: any[];
  @Input('user') user: any;
  @Output('notify') notify = new EventEmitter<boolean>();
  eventStatus: any[];
  statusForAdmin: any[];
  eventSort: any[];
  eventTypes: any[];
  members: any[];
  eventStatusEnum = EventStatusEnum;
  eventSortEnum = EventSortEnum;
  sortedEnum = SortOptionsEnum;

  @ViewChild('toggle') toggle: ElementRef;


  testBoolean: boolean = false;

  constructor(
    public override injector: Injector,
    private _builder: UntypedFormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadEventTypes();
    this.loadMembers();
    this.getStatus();
    this.getStatusForAdmin();
    this.getEventSort();
    console.log("EventFiltersComponent", this.form.getRawValue());
  }
  chowDeleteIcon(): boolean {
    if (this.form.get('name').value == null) return false
    else if (this.form.get('name').value?.trim().length != 0) return true;
    return false;
  }

  onSortChanges(sortedEnum: SortOptionsEnum) {
    this.form.controls['sortOrder'].patchValue(sortedEnum)
    console.log(this.form.getRawValue().sortOrder);
  }

  private getStatus() {
    this.eventStatus = Object.keys(EventStatusEnum).map(id => ({ id, name: EventStatusEnum[id] })).slice(0, 4).sort((a, b) => a.name.localeCompare(b.name));
    if (this.eventStatus.map(x => x.name).includes('All')) return;
    let _new = { id: ' ', name: "All" };
    this.eventStatus?.push(_new);
    this.eventStatus?.sort((a, b) => a.name.localeCompare(b.name))

  }
  private getStatusForAdmin() {
    this.statusForAdmin = Object.keys(EventStatusEnum).map(id => ({ id, name: EventStatusEnum[id] })).slice(1, 4).sort((a, b) => a.name.localeCompare(b.name));
    if (this.statusForAdmin.map(x => x.name).includes('All')) return;
    let _new = { id: ' ', name: "All" };
    this.statusForAdmin?.push(_new)
    this.statusForAdmin?.sort((a, b) => a.name.localeCompare(b.name));
  }

  private getEventSort() {
    this.eventSort = Object.keys(EventSortEnum).map(id => ({ id, name: EventSortEnum[id] })).slice(0, 5).sort((a, b) => a.name.localeCompare(b.name));
    this.eventSort?.sort((a, b) => a.name.localeCompare(b.name));
  }

  export() {
    let body = this.getBody();
    this.httpService.ExportExcel(EventsController.ExportVendorEvents(this.user.businessId), body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .toPromise()
      .then((data: any) => {
        saveAs(data, `Events.xlsx`);
      });
  }

  getBody() {
    let body = this.form.getRawValue();
    if (this.form?.controls['status'].value === null || this.form?.controls['status'].value == ' ')
      body.status = null;
    else
      body.status = Number(body.status);

    if (this.form?.controls['eventTypeId'].value == null || this.form?.controls['eventTypeId'].value == ' ')
      body.eventTypeId = null;

    if (this.form?.controls['memberId'].value == null || this.form?.controls['memberId'].value == ' ')
      body.memberId = null;


    return body;
  }

  clearSearchBar() {
    this.form.controls['name'].reset();
  }

  toggleSearch() {
    if (!this.dropdownOpen) {
      console.log("hello");
      this.dropdownOpen = true;
      document.querySelector<HTMLElement>(".events-dropdown-list").style.display = "block";
    } else {
      this.dropdownOpen = false;
      document.querySelector<HTMLElement>(".events-dropdown-list").style.display = "none";
      console.log("none");
    }
    this.testBoolean = false;
  }

  onClick(event) {
    if (event.target.classList.contains('ng-option') || event.target.tagName.toLowerCase().trim() == 'b') 
      this.testBoolean = false;
    if (this.toggle?.nativeElement?.contains(event.target) == false && this.testBoolean)
      if (this.dropdownOpen)
        this.toggleSearch();

    this.testBoolean = true;
  }

  search() {
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.notify.emit(true);
  }

  clear() {
    // here clear spacific controls becouse i didin't want clear sortField and sortOrder
    this.form.controls['name'].reset();
    this.form.controls['eventTypeId'].reset();
    this.form.controls['startDate'].reset();
    this.form.controls['endDate'].reset();
    this.form.controls['status'].reset();
    this.form.controls['memberId'].reset();
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.notify.emit(true);
  }

  loadEventTypes() {
    this.httpService.GET(EventTypesController.DropDownForEventsFilter)
      .subscribe((eventTypes) => {
        console.log(eventTypes);
        this.eventTypes = eventTypes;
        // if (this.eventTypes.length == 0) return
        // let _new = { id: ' ', name: "All" };
        // this.eventTypes?.push(_new)
        // this.eventTypes?.sort((a, b) => a.name.localeCompare(b.name));
      });
  }
  clearStartDate() {
    this.form.controls['startDate'].reset()
  }
  clearEndDate() {
    this.form.controls['endDate'].reset()
  }

  loadMembers() {
    if (this.currentUser?.roles.includes(this.localAdminRole) || this.currentUser?.roles.includes(this.superAdminRole) || this.currentUser?.roles.includes(this.committeeMemberRole)) return;
    this.httpService.GET(MembersController.MembersDrp)
      .subscribe((res) => {
        console.log(res);
        this.members = res;
      });
  }

}
