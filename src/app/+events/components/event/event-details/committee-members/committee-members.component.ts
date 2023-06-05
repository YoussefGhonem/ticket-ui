import { RolesEnum } from './../../../../../+auth/models/enums';
import { debounceTime, takeUntil, map } from 'rxjs/operators';
import { Component, EventEmitter, Injector, Input, OnInit, Output, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { EventMembersController, EventsController } from 'app/+events/controllers';
import { EventAllowedActions } from 'app/+events/models';
import { ActivateComponent } from '@shared/components/activate/activate.component';
import { ngbModalOptions } from '@shared/default-values';
import { UsersController } from 'app/+users/controllers';
import { DeactivateComponent } from '@shared/components/deactivate/deactivate.component';
import { MemberAllowedActions } from 'app/+vendors/models';
import { MembersController } from 'app/+vendors/controllers';
import { UnassignMemberComponent } from './unassign-member/unassign-member.component';
import { TableDataAdapterService } from '@libs/primeng-table/services/table-data-adapter.service';
import { TableColumn } from '@libs/primeng-table/models/table-column.model';
import { ChangeRoleComponent } from 'app/+vendors/components/commitee-members/change-role/change-role.component';
import { MakeContactMemberComponent } from './make-contact-member/make-contact-member.component';
@Component({
  selector: 'app-event-committee-members',
  templateUrl: './committee-members.component.html',
  styleUrls: ['./committee-members.component.scss']
})
export class EventCommitteeMembersComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() allowedAction: EventAllowedActions[];
  @Output('loadActivities') loadActivities = new EventEmitter();

  eventAllowedActions = EventAllowedActions;
  total: number = 0;
  form: FormGroup;
  id: any;
  memberAllowedActions = MemberAllowedActions;
  pageNumber = 1;
  pageSize = 10;
  selectedRows: any[] = [];
  selectedContactRows: any[] = [];
  selectedUnContactRows: any[] = [];
  previewUser: any = null;

  myEvent: any = null;

  columns: TableColumn<any>[] = [];

  constructor(
    public modalService: NgbModal, public tableService: TableDataAdapterService,
    public activeModal: NgbActiveModal, private activatedRoute: ActivatedRoute, public override injector: Injector,
    private _formBuilder: FormBuilder,
    private offcanvasService: NgbOffcanvas) {
    super(injector);
    this.columns = [
      { title: 'Select', field: 'checkBox', type: 'custom', visible: true, allowSorting: false },
      { title: 'Name', field: 'name', type: 'custom', visible: true, allowSorting: true },
      { title: 'Phone Number', field: 'phoneNumber', type: 'text', visible: true, allowSorting: true },
      { title: 'Created Date', field: 'createdDate', type: 'datetime', visible: true, allowSorting: true },
      { title: 'Status', field: 'isActive', type: 'custom', visible: true, allowSorting: true },
      { title: 'Locked', field: 'isLocked', type: 'custom', visible: true, allowSorting: true },
      { title: 'Contact', field: 'isContact', type: 'custom', visible: true, allowSorting: true },
      { title: 'Actions', field: 'actions', type: 'custom', visible: true, allowSorting: false },
    ];
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        this.id = params.get('id');
      });
    this.initSearchForm();
    this.tableService.setupTable(EventMembersController.GetEventMembers(this.id), this.columns, this.form?.getRawValue());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.allowedAction?.includes(EventAllowedActions.EditWhenDraftOrPublished))
      this.columns = [
        { title: 'Select', field: 'checkBox', type: 'custom', visible: true, allowSorting: false },
        { title: 'Name', field: 'name', type: 'custom', visible: true, allowSorting: true },
        { title: 'Phone Number', field: 'phoneNumber', type: 'text', visible: true, allowSorting: true },
        { title: 'Created Date', field: 'createdDate', type: 'datetime', visible: true, allowSorting: true },
        { title: 'Status', field: 'isActive', type: 'custom', visible: true, allowSorting: true },
        { title: 'Locked', field: 'isLocked', type: 'custom', visible: true, allowSorting: true },
        { title: 'Contact', field: 'isContact', type: 'custom', visible: true, allowSorting: true },
        { title: 'Actions', field: 'actions', type: 'custom', visible: true, allowSorting: false },
      ];
    else
      this.columns = [
        { title: 'Name', field: 'name', type: 'custom', visible: true, allowSorting: true },
        { title: 'Phone Number', field: 'phoneNumber', type: 'text', visible: true, allowSorting: true },
        { title: 'Created Date', field: 'createdDate', type: 'datetime', visible: true, allowSorting: true },
        { title: 'Status', field: 'isActive', type: 'custom', visible: true, allowSorting: true },
        { title: 'Locked', field: 'isLocked', type: 'custom', visible: true, allowSorting: true },
        { title: 'Contact', field: 'isContact', type: 'custom', visible: true, allowSorting: true },
      ];
  }

  ngOnInit(): void {
    this.tableService.loadData(this.form?.getRawValue(), true).subscribe();
  }

  get assignedCommitteeMembersIds(): any[] {
    return this.tableService.dataList?.map(x => x?.committeeMember?.id)
  }

  pageChange(pageNumber: number) {
    this.form.controls['pageNumber'].patchValue(pageNumber, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.tableService.loadData(this.form?.getRawValue(), true).subscribe();
  }

  onCheckBoxChange(row: any, event) {
    let id = row?.committeeMember?.id;
    let isChecked = event.target.checked;
    console.log(this.selectedRows);
    console.log(this.selectedContactRows);
    console.log(this.selectedUnContactRows);

    if (isChecked) {
      this.selectedRows.push(id);
      if (row.isContact) this.selectedContactRows.push(id);
      else this.selectedUnContactRows.push(id);
    }
    else {
      this.selectedRows.splice(this.selectedRows.indexOf(id), 1);
      if (row.isContact) this.selectedContactRows.splice(this.selectedContactRows.indexOf(id), 1);
      else this.selectedUnContactRows.splice(this.selectedUnContactRows.indexOf(id), 1);
    }

  }

  refreshSelectRows(id: any) {
    if (this.selectedUnContactRows?.includes(id)) {
      const indexOfObject = this.selectedUnContactRows.findIndex((object) => { return object.id === id; });
      this.selectedUnContactRows?.splice(indexOfObject, 1);
    }
    else if (this.selectedContactRows?.includes(id)) {
      const indexOfObject = this.selectedContactRows.findIndex((object) => { return object.id === id; });
      this.selectedContactRows?.splice(indexOfObject, 1);
    }
  }

  loadData() {
    this.tableService.loadData(this.form?.getRawValue()).subscribe();
  }

  patchChecked(rowData): boolean {
    return this.selectedRows?.includes(rowData?.committeeMember?.id);
  }

  refreshSelectedRows(isContact: boolean = null) {
    let obj: any;
    if (isContact == null) return
    if (isContact) {
      obj = this.changeToOpposite(this.selectedUnContactRows, this.selectedContactRows);
      this.selectedUnContactRows = obj.first;
      this.selectedContactRows = obj.second;
    }
    if (!isContact) {
      obj = this.changeToOpposite(this.selectedContactRows, this.selectedUnContactRows);
      this.selectedUnContactRows = obj.second;
      this.selectedContactRows = obj.first;
    }
    this.tableService.loadData(undefined, true).subscribe();
  }

  private changeToOpposite(first: any[], second: any[]) {
    first.forEach(e => {
      second.push(e);
    })
    first = [];
    return { first, second };
  }

  memberAllowedAction(member: any, action: MemberAllowedActions): boolean {
    let allowedActions = member?.memberAllowedActions as Array<MemberAllowedActions>
    return allowedActions?.includes(action);
  }

  eventAllowedAction(action: EventAllowedActions): boolean {
    let allowedActions = this.allowedAction as Array<EventAllowedActions>;
    return allowedActions?.includes(action);
  }


  Unassigned(item: any) {
    const modalRef = this.modalService.open(UnassignMemberComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-warning'
    });
    modalRef.componentInstance.title = item.committeeMember.name;

    modalRef.componentInstance.url = EventMembersController.RemoveMemberFromEvent(this.id, item.committeeMember.id);
    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.activeModal.close(true);
          this.refreshSelectRows(item.committeeMember.id);
        }
      })
      .catch(() => {
      });
  }

  selectAll(event) {
    this.myEvent = event;
    if(event.target.checked){
      this.tableService.data.forEach(x => {
        if(this.selectedRows.includes(x.committeeMember?.id) == false){
          this.selectedRows.push(x.committeeMember?.id);
        }
        if(x.isContact) {
          if(this.selectedContactRows.includes(x.committeeMember?.id) == false){
            this.selectedContactRows.push(x.committeeMember?.id);
          }
        }
        else {
          if(this.selectedUnContactRows.includes(x.committeeMember?.id) == false){
            this.selectedUnContactRows.push(x.committeeMember?.id);
          }
        }
      })
    }
    else {
      this.selectedRows = [];
      this.selectedContactRows = [];
      this.selectedUnContactRows = [];
    }
  }

  makeContact(item: any) {
    const modalRef = this.modalService.open(MakeContactMemberComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-warning'
    });
    modalRef.componentInstance.title = item.committeeMember.name;
    modalRef.componentInstance.url = EventMembersController.SetMemberAsContact(this.id, item.committeeMember.id);
    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.activeModal.close(true);
          this.tableService.loadData(undefined, true).subscribe()
          this.refreshSelectRows(item.committeeMember.id)
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
    modalRef.componentInstance.url = EventMembersController.RemoveContactStatusFromAssignedMember(this.id, item.committeeMember.id);
    modalRef.componentInstance.isContact = false;
    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.activeModal.close(true);
          this.tableService.loadData(undefined, true).subscribe()
          this.refreshSelectRows(item.committeeMember.id)
        }
      })
      .catch(() => {
      });
  }

  search() { this.tableService.loadData(this.form?.getRawValue()).subscribe() }

  private initSearchForm(): void {
    this.form = this._formBuilder.group({
      // Pagination
      pageNumber: new FormControl(1),
      pageSize: new FormControl(10),
      //filters
      searchWord: new FormControl(null),
      isActive: new FormControl(null),
      isLocked: new FormControl(null),
      createdDate: new FormControl(null),
      // for export
      sortField: new FormControl(null),
      sortOrder: new FormControl(null),
      columns: [],
      currentTimeZoneDifferenceInMinutes: new FormControl((new Date()).getTimezoneOffset())
    });
    this.form.controls['searchWord'].valueChanges
      .pipe(debounceTime(500))
      .subscribe(res => {
        this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
        this.tableService.loadData(this.form?.getRawValue(), true).subscribe();
      });
  }

  openOrderSlider(content: TemplateRef<any>, selectedUser: any) {
    this.previewUser = selectedUser;
    console.log(this.previewUser);
    this.offcanvasService.open(content, { position: 'end' });
  }

  fire(event: any) {
    console.log(event);
    this.tableService.selectedColumns = (event as TableColumn<any>[]);
    console.log(this.tableService.selectedColumns);
  }

  updateUser() {
    this.tableService.loadData(undefined, true).subscribe(res => {
      if(this.previewUser == null) return;
      this.previewUser = this.tableService.data.filter(x => x.committeeMember.id == this.previewUser.committeeMember.id)[0];
    });
  }

}
