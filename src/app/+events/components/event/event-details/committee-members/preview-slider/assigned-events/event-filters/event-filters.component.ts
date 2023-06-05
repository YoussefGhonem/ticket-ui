import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormGroup, UntypedFormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { SortOptionsEnum } from "@libs/primeng-table/models/enums";
import { TableDataAdapterService } from "@libs/primeng-table/services/table-data-adapter.service";
import { NgbActiveModal, NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "@shared/base/base.component";
import { ngbModalOptions } from "@shared/default-values";
import { EventMembersController, EventsController } from "app/+events/controllers";
import { EventStatusEnum, EventSortEnum, EventAllowedActions } from "app/+events/models";
import { EventTypesController } from "app/+settings/controllers";
import { MembersController } from "app/+vendors/controllers";
import { MemberAllowedActions } from "app/+vendors/models";
import * as saveAs from "file-saver";
import { takeUntil } from "rxjs/operators";
import { EventCommitteeMembersComponent } from "../../../committee-members.component";
import { MakeContactMemberComponent } from "../../../make-contact-member/make-contact-member.component";
import { UnassignMemberComponent } from "../../../unassign-member/unassign-member.component";

@Component({
  selector: "member-event-filters",
  templateUrl: "./event-filters.component.html",
  styleUrls: ["./event-filters.component.scss"],
})
export class MemberEventFiltersComponent extends BaseComponent implements OnInit {
  public dropdownOpen: boolean = false;
  @Input("form") form: FormGroup;
  @Input("events") events: any[];
  @Input('eventId') eventId: any = null;
  @Input('user') user: any = null;
  @Input('allowedAction') allowedAction: any[];
  @Output("notify") notify = new EventEmitter<boolean>();
  eventStatus: any[];
  statusForAdmin: any[];
  eventSort: any[];
  eventTypes: any[];
  members: any[];
  eventStatusEnum = EventStatusEnum;
  eventSortEnum = EventSortEnum;
  sortedEnum = SortOptionsEnum;
  eventAllowedActions = EventAllowedActions;
  memberAllowedActions = MemberAllowedActions;
  @Output("loadMembersEvent") loadMembersEvent = new EventEmitter<string>();


  @ViewChild('toggle') toggle: ElementRef;

  testBoolean: boolean = false;
  constructor(
    public override injector: Injector,
    public activeModal: NgbActiveModal,
    public router: Router,
    private offcanvasService: NgbOffcanvas,
    public modalService: NgbModal,
    public tableService: TableDataAdapterService,

    private _builder: UntypedFormBuilder) {
    super(injector);
  }

  eventAllowedAction(action: EventAllowedActions): boolean {
    let allowedActions = this.allowedAction as Array<EventAllowedActions>;
    return allowedActions?.includes(action);
  }

  ngOnInit(): void {
    this.loadEventTypes();
    this.loadMembers();
    this.getStatus();
    this.getStatusForAdmin();
    this.getEventSort();
    console.log("EventFiltersComponent", this.form.getRawValue());
    console.log("User from filters : ", this.user)
  }

  Unassigned(item: any) {
    const modalRef = this.modalService.open(UnassignMemberComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-warning'
    });
    modalRef.componentInstance.title = item.committeeMember.name;

    modalRef.componentInstance.url = EventMembersController.RemoveMemberFromEvent(this.eventId, item.committeeMember.id);
    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.activeModal.close(true);
          this.notify.emit(true);
          this.offcanvasService.dismiss('Cross click');
          this.tableService.loadData(undefined, true).subscribe();
        }
      })
      .catch(() => {
      });
  }

  makeContact(item: any) {
    const modalRef = this.modalService.open(MakeContactMemberComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-warning'
    });
    modalRef.componentInstance.title = item.committeeMember.name;
    modalRef.componentInstance.url = EventMembersController.SetMemberAsContact(this.eventId, item.committeeMember.id);
    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.activeModal.close(true);
          this.notify.emit(true);
          this.offcanvasService.dismiss('Cross click');
          this.tableService.loadData(undefined, true).subscribe();
        }
      })
      .catch(() => {
      });
  }

  makeUnContact(item: any) {
    const modalRef = this.modalService.open(MakeContactMemberComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-warning'
    });
    modalRef.componentInstance.title = item.committeeMember.name;
    modalRef.componentInstance.url = EventMembersController.RemoveContactStatusFromAssignedMember(this.eventId, item.committeeMember.id);
    modalRef.componentInstance.isContact = false;
    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.activeModal.close(true);
          this.notify.emit(true);
          this.offcanvasService.dismiss('Cross click');
          this.tableService.loadData(undefined, true).subscribe();
        }
      })
      .catch(() => {
      });
  }
  memberAllowedAction(member: any, action: MemberAllowedActions): boolean {
    let allowedActions = member?.memberAllowedActions as Array<MemberAllowedActions>
    return allowedActions?.includes(action);
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
  chowDeleteIcon(): boolean {
    if (this.form.get('name').value == null) return false
    else if (this.form.get('name').value?.trim().length != 0) return true;
    return false;
  }
  loadMembers() {
    if (this.currentUser?.roles.includes(this.localAdminRole) || this.currentUser?.roles.includes(this.superAdminRole) || this.currentUser?.roles.includes(this.committeeMemberRole)) return;
    this.httpService.GET(MembersController.MembersDrp)
      .subscribe((res) => {
        console.log(res);
        this.members = res;
      });
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

  assignedEventToggleSearch() {
    if (!this.dropdownOpen) {
      console.log("From assigned events hello");
      this.dropdownOpen = true;
      document.querySelector<HTMLElement>(".assigned-events-dropdown-list").style.display = "block";
    } else {
      this.dropdownOpen = false;
      document.querySelector<HTMLElement>(".assigned-events-dropdown-list").style.display = "none";
      console.log("From assigned events hello none");
    }
    this.testBoolean = false;
  }

  onClick(event) {
    if (event.target.classList.contains('ng-option') || event.target.tagName.toLowerCase().trim() == 'b')
      this.testBoolean = false;
    if (this.toggle?.nativeElement?.contains(event.target) == false && this.testBoolean)
      if (this.dropdownOpen)
        this.assignedEventToggleSearch();

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
  clearStartDate() {
    this.form.controls['startDate'].reset()
  }
  clearEndDate() {
    this.form.controls['endDate'].reset()
  }
  exportAssignedEvents() {
    let body = this.getBody();
    this.httpService.ExportExcel(EventsController.ExportAssignedEventsToExcel(this.user?.committeeMember?.id), body)
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
  onSortChanges(sortedEnum: SortOptionsEnum) {
    this.form.controls['sortOrder'].patchValue(sortedEnum)
    console.log(this.form.getRawValue().sortOrder);
  }
  clearSearchBar() {
    this.form.controls['name'].reset();
  }

}

