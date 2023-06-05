import { EventMembersController } from 'app/+events/controllers';

import { FormGroup } from '@angular/forms';
import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AssignCommitteeMembersComponent } from '../assign-committee-members/assign-committee-members.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ngbModalOptions } from '@shared/default-values';
import { ActivatedRoute, Router } from '@angular/router';
import { EventAllowedActions } from 'app/+events/models';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@shared/base/base.component';
import * as saveAs from 'file-saver';
import { CreateMemberComponent } from '../create-member/create-member.component';
import { UnassignMembersComponent } from '../unassign-members/unassign-members.component';
import { TableDataAdapterService } from '@libs/primeng-table/services/table-data-adapter.service';

@Component({
  selector: 'committee-members-filters',
  templateUrl: './committee-members-filters.component.html',
  styleUrls: ['./committee-members-filters.component.scss'],
  host: {
    '(document:click)': 'onClick($event)'
  }
})
export class CommitteeMembersFiltersComponent extends BaseComponent implements OnInit {
  @Input('form') form: FormGroup;
  @Input('allowedAction') allowedAction: EventAllowedActions[];
  @Input('tableService') tableService: any;
  @Input('selectedRows') selectedRows: any[];
  @Input('selectedUnContactRows') selectedUnContactRows: any[];
  @Input('selectedContactRows') selectedContactRows: any[];
  eventAllowedActions = EventAllowedActions;
  @Input('assignedCommitteeMembersIds') assignedCommitteeMembersIds: any[];
  @Output('notify') notify = new EventEmitter<boolean>();
  @Output('refreshSelectedRows') refreshSelectedRows = new EventEmitter<boolean>();
  id: any;
  public dropdownOpen: boolean = false;
  @ViewChild('toggle') toggle: ElementRef;

  testBoolean: boolean = false;

  constructor(public modalService: NgbModal, public override injector: Injector,
    public activeModal: NgbActiveModal, private activatedRoute: ActivatedRoute) {
    super(injector);
    this.activatedRoute.paramMap
      .subscribe(params => {
        this.id = params.get('id');
      });
  }

  eventAllowedAction(action: EventAllowedActions): boolean {
    let allowedActions = this.allowedAction as Array<EventAllowedActions>
    return allowedActions?.includes(action);
  }

  ngOnInit(): void {
  }

  search() {
    let filters = this.form.getRawValue();
    filters.createdDate = this.form.getRawValue()?.createdDate?.toLocaleString();
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    // this.notify.emit()
    this.tableService.loadData(filters).subscribe();
    this.toggleSearch();
  }

  clear() {
    this.form.reset();
    let filters = this.form.getRawValue();
    filters.createdDate = this.form.getRawValue()?.createdDate?.toLocaleString();
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.form.controls['currentTimeZoneDifferenceInMinutes'].patchValue((new Date()).getTimezoneOffset());
    // this.notify.emit()
    this.tableService.loadData(filters).subscribe();
  }

  get disabledExport(): boolean {
    let columns = this.tableService?.selectedColumns.filter(x => x.visible && x.field != 'actions')
    if (columns?.length == 1 && columns?.map(x => x.field).includes('actions')) return true;
    return this.assignedCommitteeMembersIds?.length == 0 || this.tableService?.dataList?.length == 0 || columns?.length == 0
  }

  makAsContact() {
    let body = { membersIds: this.selectedUnContactRows }
    console.log("body", body);
    if (this.selectedUnContactRows?.length == 0) return
    this.httpService.PUT(EventMembersController.SetMembersAsContacts(this.id), body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.notificationService.success('Saved successfully', 'Your Changes are saved successfully! 🎉');
        this.refreshSelectedRows.emit(true)
      });
  }
  chowDeleteIcon(): boolean {
    if (this.form.get('searchWord').value == null) return false
    else if (this.form.get('searchWord').value?.trim().length != 0) return true;
    return false;
  }
  removeAsContact() {
    let body = { membersIds: this.selectedContactRows }
    if (this.selectedContactRows?.length == 0) return;
    this.httpService.PUT(EventMembersController.RemoveMembersAsContacts(this.id), body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.notificationService.success('Saved successfully', 'Your Changes are saved successfully! 🎉');
        this.refreshSelectedRows.emit(false);
      });
  }

  clearSearchBar() {
    this.form.controls['searchWord'].reset()
  }

  clearDate() {
    this.form.controls['createdDate'].reset()
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
    if (event.target.classList.contains('ng-option'))
      this.testBoolean = false;
    if (this.toggle?.nativeElement?.contains(event.target) == false && this.testBoolean)
      if (this.dropdownOpen)
        this.toggleSearch();

    this.testBoolean = true;
  }

  export() {
    let body = this.getBody();
    if (body.columns.includes('name')) body.columns.push('email');
    console.log("Expoert this.form?.getRawValue()=>>>>>>>>", body);

    this.httpService.ExportExcel(EventMembersController.ExportToExcel(this.id), body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .toPromise()
      .then((data: any) => {
        saveAs(data, `Members.xlsx`);
      });
  }

  getBody() {
    let columns = this.tableService.selectedColumns?.filter(x => x.visible && x.field != 'actions' && x.field != 'checkBox').map(x => x.field);
    this.form.controls['columns']?.patchValue(columns)
    this.form.controls['sortField']?.patchValue(this.tableService?.pagingAndSorting?.sortField);
    this.form.controls['sortOrder']?.patchValue(this.tableService?.pagingAndSorting?.sortOrder);

    let body = this.form?.getRawValue();

    if (this.form?.controls['isActive'].value === null || this.form?.controls['isActive'].value === ' ')
      body.isActive = null;

    return body;
  }

  create(event) {
    const modalRef = this.modalService.open(CreateMemberComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-success',
      size: 'md'
    });
    modalRef.componentInstance.eventId = this.id;

    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.notify.emit())
      .catch(() => {
      });
  }

  assginMember(event) {
    const modalRef = this.modalService.open(AssignCommitteeMembersComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-success',
      size: 'md'
    });
    modalRef.componentInstance.eventId = this.id;
    modalRef.componentInstance.assignedCommitteeMembersIds = this.assignedCommitteeMembersIds;

    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.notify.emit())
      .catch(() => {
      });
  }

  unassginMember() {
    const selectedRows = [...this.selectedUnContactRows, ...this.selectedContactRows];
    const modalRef = this.modalService.open(UnassignMembersComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-danger'
    });
    modalRef.componentInstance.selectedRows = selectedRows;
    modalRef.componentInstance.eventId = this.id;

    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.notify.emit() || this.refreshSelectedRows.emit(true))
      .catch(() => {
      });
  }

}
