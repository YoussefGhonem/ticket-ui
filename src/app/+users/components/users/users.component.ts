import { takeUntil, debounceTime } from 'rxjs/operators';
import { Component, Injector, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { ngbModalOptions } from '@shared/default-values';
import { CreateUserComponent } from '../create-user/create-user.component';
import { RolesEnum } from "app/+auth/models";
import { UsersTableComponent } from './users-table/users-table.component';
import { UsersController } from 'app/+users/controllers';
import * as saveAs from 'file-saver';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  host: {
    '(document:click)': 'onClick($event)'
  }
})
export class UsersComponent extends BaseComponent implements OnInit {
  @ViewChild(UsersTableComponent) usersTableComponent: UsersTableComponent;
  form: FormGroup;
  userRolesEnum = RolesEnum;
  users: any[]
  total: number = 0;
  breadCrumbItems!: Array<{}>;
  activeId = 1;
  public dropdownOpen: boolean = false;


  @ViewChild('toggle') toggle: ElementRef;


  testBoolean: boolean = false;

  dict = {
    1: [
      { label: 'Home' },
      { label: 'Users', active: true },
    ],
    3: [
      { label: 'Home' },
      { label: 'Users', active: true },
      { label: 'Vendor', active: true }
    ],
    5: [
      { label: 'Home' },
      { label: 'Users', active: true },
      { label: 'Committee Members', active: true }
    ],
    6: [
      { label: 'Home' },
      { label: 'Users', active: true },
      { label: 'Customers', active: true }
    ],
    2: [
      { label: 'Home' },
      { label: 'Users', active: true },
      { label: 'Local Admins', active: true }
    ]
  };

  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public override injector: Injector,
    private _formBuilder: FormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.breadCrumbItems = this.dict[this.activeId];
    this.initSearchForm();
  }
  search() {
    let filters = this.form.getRawValue();
    filters.createdDate = this.form.getRawValue()?.createdDate?.toLocaleString();
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.usersTableComponent.loadTable(filters);
    this.toggleSearch();
  }

  clear() {
    this.form.reset();
    let filters = this.form.getRawValue();
    filters.createdDate = this.form.getRawValue()?.createdDate?.toLocaleString();
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.usersTableComponent.loadTable(filters);
  }

  private initSearchForm(): void {
    this.form = this._formBuilder.group({
      // Pagination
      pageNumber: new FormControl(1),
      pageSize: new FormControl(10),
      //filters
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
  }

  clearSearchBar() {
    this.form.controls['searchWord'].reset()
  }

  chowDeleteIcon() {
    if(this.form.get('searchWord').value == null) return false;
    if(this.form.get('searchWord').value != '') return true;

    return false;
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
  showDeleteIcon(): boolean {
    if (this.form.get('searchWord').value == null) return false
    else if (this.form.get('searchWord').value?.trim().length != 0) return true;
    return false;
  }
  onClick(event) {
    if (event.target.classList.contains('ng-option') || event.target.tagName.toLowerCase().trim() == 'b')
      this.testBoolean = false;
    if (this.toggle?.nativeElement?.contains(event.target) == false && this.testBoolean)
      if (this.dropdownOpen)
        this.toggleSearch();

    this.testBoolean = true;
  }

  export() {
    let body = this.getBody();
    let fileName = RolesEnum[this.form?.getRawValue().role] ?? 'Users';
    const result = fileName.replace(/([A-Z])/g, " $1");
    fileName = result.charAt(0).toUpperCase() + result.slice(1);

    this.httpService.ExportExcel(UsersController.ExportToExcel, body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .toPromise()
      .then((data: any) => {
        saveAs(data, `${fileName.trim()}.xlsx`);
      });
  }

  getBody() {
    let columns = this.usersTableComponent?.tableService?.selectedColumns?.filter(x => x.visible && x.field != 'actions').map(x => x.field);
    if (this.usersTableComponent.tableService?.selectedColumns.map(x => x.field).includes('name')) {
      columns.push('email');
    }
    console.log(columns);

    this.form.controls['columns'].patchValue(columns);

    this.form.controls['sortField']?.patchValue(this.usersTableComponent?.tableService?.pagingAndSorting?.sortField)
    this.form.controls['sortOrder']?.patchValue(this.usersTableComponent?.tableService?.pagingAndSorting?.sortOrder)
    this.form.controls['pageSize'].patchValue(0);

    let body = this.form.getRawValue();

    if (this.form?.controls['isActive'].value === null || this.form?.controls['isActive'].value == ' ')
      body.isActive = null;


    return body;
  }

  disabledExport(): boolean {
    let columns = this.usersTableComponent?.tableService?.selectedColumns.filter(x => x.visible && x.field != 'actions')
    if (columns?.length == 1 && columns?.map(x => x.field).includes('actions')) return true;
    return this.usersTableComponent?.tableService?.dataList?.length == 0 || columns?.length == 0
  }

  get showCreateDropdowne(): boolean {
    return this.form.controls['role'].value == this.userRolesEnum.Vendor || this.form.controls['role'].value == null || this.form.controls['role'].value == this.userRolesEnum.LocalAdmin
  }

  onRoleChanges(role: RolesEnum = null) {
    this.form.controls['role'].patchValue(role);
    this.breadCrumbItems = this.dict[role ?? 1];
  }

  createUser(role: RolesEnum) {
    const modalRef = this.modalService.open(CreateUserComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-success',
      size: 'md'
    });
    modalRef.componentInstance.role = role;

    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.usersTableComponent.loadTable(undefined))
      .catch(() => {
      });
  }

  isCurrentUserSuperAdmin() {
    return this.currentUser.roles.includes(RolesEnum[RolesEnum.SuperAdmin]);
  }

}
