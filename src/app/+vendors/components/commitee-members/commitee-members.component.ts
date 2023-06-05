import { ChangeRoleComponent } from './change-role/change-role.component';
import { RolesEnum } from 'app/+auth/models';
import { DeleteComponent } from '@shared/components/delete/delete.component';
import { ActivateComponent } from '@shared/components/activate/activate.component';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Component, ElementRef, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '@shared/base/base.component';
import { NgbActiveModal, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CreateMemberComponent } from './create-member/create-member.component';
import { ngbModalOptions } from '@shared/default-values';
import { DeactivateComponent } from '@shared/components/deactivate/deactivate.component';
import { UnlockComponent } from '@shared/components/unlock/unlock.component';
import { MembersController } from "app/+vendors/controllers";
import { UsersController } from "app/+users/controllers";
import { TableColumn } from '@libs/primeng-table/models/table-column.model';
import { TableDataAdapterService } from '@libs/primeng-table/services/table-data-adapter.service';
import * as saveAs from 'file-saver';
import { MemberAllowedActions } from 'app/+vendors/models';

@Component({
  selector: 'app-commitee-members',
  templateUrl: './commitee-members.component.html',
  styleUrls: ['./commitee-members.component.scss'],
  host: {
    '(document:click)': 'onClick($event)'
  }
})
export class CommiteeMembersComponent extends BaseComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  committeeMembers: any[] = [];
  total: number = 0;
  form!: FormGroup;
  userRolesEnum = RolesEnum;
  memberAllowedActions = MemberAllowedActions;
  activeId = 1;
  columns: TableColumn<any>[] = [];
  @ViewChild('toggle') toggle: ElementRef;
  previewUser: any = null;


  testBoolean: boolean = false;

  public dropdownOpen: boolean = false;

  // Table
  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal, public override injector: Injector, private _formBuilder: FormBuilder,
    public tableService: TableDataAdapterService,
    private offcanvasService: NgbOffcanvas) {
    super(injector);

    this.columns = [
      { title: 'Name', field: 'name', type: 'custom', visible: true, allowSorting: true },
      { title: 'Phone Number', field: 'phoneNumber', type: 'text', visible: true, allowSorting: true },
      { title: 'Role', field: 'role', type: 'custom', visible: true, allowSorting: true },
      { title: 'Created Date', field: 'createdDate', type: 'datetime', visible: true, allowSorting: true },
      { title: 'Status', field: 'isActive', type: 'custom', visible: true, allowSorting: true },
      { title: 'Locked', field: 'isLocked', type: 'custom', visible: true, allowSorting: true },
      { title: 'Actions', field: 'actions', type: 'custom', visible: true, allowSorting: false },
    ];
    this.initSearchForm();
    this.tableService.setupTable(MembersController.GetVendorMembersByVendor, this.columns, this.form?.getRawValue());
  }

  search() {
    let filters = this.form.getRawValue();
    filters.createdDate = this.form.getRawValue()?.createdDate?.toLocaleString();
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.tableService.loadData(filters).subscribe();
    this.toggleSearch();
  }

  clearDate() {
    this.form.controls['createdDate'].reset()
  }
  chowDeleteIcon(): boolean {
    if (this.form.get('searchWord').value == null) return false
    else if (this.form.get('searchWord').value?.trim().length != 0) return true;
    return false;
  }
  clear() {
    this.form.reset();
    let filters = this.form.getRawValue();
    filters.createdDate = this.form.getRawValue()?.createdDate?.toLocaleString();
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.tableService.loadData(filters).subscribe();
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
    if (event.target.classList.contains('ng-option') || event.target.tagName.toLowerCase().trim() == 'b')
      this.testBoolean = false;
    if (this.toggle?.nativeElement?.contains(event.target) == false && this.testBoolean)
      if (this.dropdownOpen)
        this.toggleSearch();

    this.testBoolean = true;
  }

  clearSearchBar() {
    this.form.controls['searchWord'].reset()
  }

  get showCreateDropdowne(): boolean {
    return this.form.controls['role'].value == this.userRolesEnum.VendorAdmin || this.form.controls['role'].value == null || this.form.controls['role'].value == this.userRolesEnum.CommitteeMember
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Users', active: true }
    ];
  }

  export() {
    let body = this.getBody();
    let fileName = RolesEnum[this.form?.getRawValue().role] ?? 'Users';
    this.form.controls['pageSize'].patchValue(0, { emitEvent: false });
    // huminaze fileName
    const result = fileName.replace(/([A-Z])/g, " $1");
    fileName = result.charAt(0).toUpperCase() + result.slice(1);

    this.httpService.ExportExcel(MembersController.ExportToExcel, body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .toPromise()
      .then((data: any) => {
        saveAs(data, `${fileName.trim()}.xlsx`);
      });
  }

  onRoleChanges(role: RolesEnum = null) {
    this.form.controls['role'].patchValue(role);
    this.tableService.loadData(this.form.getRawValue()).subscribe();
  }

  get disabledExport(): boolean {
    let columns = this.tableService?.selectedColumns.filter(x => x.visible && x.field != 'actions')
    if (columns?.length == 1 && columns?.map(x => x.field).includes('actions')) return true;
    return this.tableService?.dataList?.length == 0 || columns?.length == 0;
  }

  getBody() {
    let columns = this.tableService?.selectedColumns?.filter(x => x.visible && x.field != 'actions').map(x => x.field);

    if (this.tableService?.selectedColumns.map(x => x.field).includes('name')) {
      columns.push('email');
    }

    this.form.controls['columns'].patchValue(columns);
    this.form.controls['pageSize'].patchValue(0);
    this.form.controls['sortField']?.patchValue(this.tableService?.pagingAndSorting?.sortField);
    this.form.controls['sortOrder']?.patchValue(this.tableService?.pagingAndSorting?.sortOrder);

    let body = this.form.getRawValue();
    if (this.form?.controls['isActive'].value == null || this.form?.controls['isActive'].value == ' ')
      body.isActive = null;

    return body;

  }


  private initSearchForm(): void {
    this.form = this._formBuilder.group({
      // Pagination
      pageNumber: new FormControl(1),
      pageSize: new FormControl(10),
      // filters
      searchWord: new FormControl(null),
      isActive: new FormControl(null),
      isLock: new FormControl(null),
      createdDate: new FormControl(null),
      role: new FormControl(null),
      // for export
      sortField: new FormControl(null),
      sortOrder: new FormControl(null),
      columns: [],
      currentTimeZoneDifferenceInMinutes: new FormControl((new Date()).getTimezoneOffset())
    });

    this.form.controls['searchWord'].valueChanges
      .pipe(debounceTime(500))
      .subscribe(res => {
        this.tableService.loadData(this.form.getRawValue(), true).subscribe();
      });
  }


  pageChange(pageNumber: number) {
    this.form.controls['pageNumber'].patchValue(pageNumber, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.tableService.loadData(this.form.getRawValue()).subscribe();
  }

  getRoleString(item: any) {
    return item.role == this.userRolesEnum.CommitteeMember ?
      this.userRolesEnum[this.userRolesEnum.CommitteeMember] :
      this.userRolesEnum[this.userRolesEnum.VendorAdmin]
  }

  hasAllowedAction(user: any, action: MemberAllowedActions): boolean {
    return user?.allowedActions?.includes(action);
  }

  isCurrentUserVendor() {
    return this.currentUser?.roles[0] === this.userRolesEnum[this.userRolesEnum.Vendor]
  }

  activate(user: any) {
    const modalRef = this.modalService.open(ActivateComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-success'
    });
    modalRef.componentInstance.title = user.name;
    modalRef.componentInstance.id = user.id;
    modalRef.componentInstance.url = UsersController.Activate(user.id);
    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.tableService.loadData(undefined, true).subscribe())
      .catch(() => {
      });
  }

  deactivate(user: any) {
    const modalRef = this.modalService.open(DeactivateComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-danger'
    });
    modalRef.componentInstance.title = user.name;
    modalRef.componentInstance.id = user.id;
    modalRef.componentInstance.url = UsersController.Deactivate(user.id);
    modalRef.componentInstance.reason = true;
    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.tableService.loadData(undefined, true).subscribe())
      .catch(() => {
      });
  }

  changeMemberRole(user: any, action: MemberAllowedActions) {
    const modalRef = this.modalService.open(ChangeRoleComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-danger'
    });
    modalRef.componentInstance.title = user.name;
    modalRef.componentInstance.action = action;
    console.log(user.allowedActions.indexOf(MemberAllowedActions.UpgradeToAdmin));
    modalRef.componentInstance.url = action == MemberAllowedActions.UpgradeToAdmin ?
      MembersController.UpgradeMember(user.id) :
      MembersController.DowngradeMember(user.id);
    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.tableService.loadData(undefined, true).subscribe())
      .catch(() => {
      });
  }

  create(role: RolesEnum) {
    const modalRef = this.modalService.open(CreateMemberComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-primary',
      size: 'md'
    });
    modalRef.componentInstance.role = role;
    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.tableService.loadData(undefined, true).subscribe())
      .catch(() => {
      });
  }

  presentDate(date: string) {
    let newDate = new Date(date);
    return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
  }

  openOrderSlider(content: TemplateRef<any>, selectedUser: any) {
    this.previewUser = selectedUser;
    console.log(this.previewUser);
    this.offcanvasService.open(content, { position: 'end' });
  }

  updateUser() {
    this.tableService.loadData(undefined, true).subscribe(res => {
      if(this.previewUser == null) return;
      console.log(this.previewUser);
      console.log(this.tableService.data);
      this.previewUser = this.tableService.data.filter(x => x.id == this.previewUser.id)[0];
    })
  }
}
