import { UnlockComponent } from '@shared/components/unlock/unlock.component';
import { UserAllowedActions } from 'app/+users/models';
import { ActivateComponent } from '@shared/components/activate/activate.component';
import { Component, EventEmitter, Injector, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { UsersController } from 'app/+users/controllers/UsersController';
import { DeleteComponent } from '@shared/components/delete/delete.component';
import { ngbModalOptions } from '@shared/default-values';
import { DeactivateComponent } from '@shared/components/deactivate/deactivate.component';
import { TableDataAdapterService } from '@libs/primeng-table/services/table-data-adapter.service';
import { TableColumn } from '@libs/primeng-table/models/table-column.model';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent extends BaseComponent implements OnInit {
  @Input('form') form: FormGroup;
  allowedActions = UserAllowedActions;
  columns : TableColumn<any>[] = [];
  previewUser: any = null;

  constructor(
    public activeModal: NgbActiveModal, public tableService: TableDataAdapterService,
    public modalService: NgbModal,
    public override injector: Injector,
    private offcanvasService: NgbOffcanvas) {
    super(injector);

      // Table
    this.columns = [
      { title: 'Name', field: 'name', type: 'custom', visible: true, allowSorting: true },
      { title: 'Phone Number', field: 'phoneNumber', type: 'text', visible: true, allowSorting: true },
      { title: 'Role', field: 'role', type: 'custom', visible: true, allowSorting: true },
      { title: 'Created Date', field: 'createdDate', type: 'datetime', visible: true, allowSorting: true },
      { title: 'Status', field: 'isActive', type: 'custom', visible: true, allowSorting: true },
      { title: 'Locked', field: 'isLocked', type: 'custom', visible: true, allowSorting: true },
      { title: 'Actions', field: 'actions', type: 'custom', visible: true, allowSorting: false },
    ];
    this.tableService.setupTable(UsersController.Users, this.columns, this.form?.getRawValue());
  }

  ngOnChanges(): void {
  }

  ngOnInit(): void {
    // TODO: Refactor this line
    this.tableService.loadData(this.form.getRawValue(), true).subscribe();
    this.form.controls['searchWord'].valueChanges
      .pipe(debounceTime(500))
      .subscribe(res => {
        this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
        this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
        this.tableService.loadData(this.form?.getRawValue()).subscribe();
      });
  }

  loadTable(form: any = this.form?.getRawValue()) {
    this.tableService.loadData(form, true).subscribe();
  }

  hasAllowedAction(user: any, action: UserAllowedActions): boolean {
    return user?.allowedActions?.includes(action);
  }

  activate(user: any) {
    const modalRef = this.modalService.open(ActivateComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-success'
    });
    modalRef.componentInstance.title = user.name;
    modalRef.componentInstance.url = UsersController.Activate(user.id);

    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.tableService.loadData(undefined, true).subscribe())
      .catch(() => {
      });
  }

  unlock(user: any) {
    const modalRef = this.modalService.open(UnlockComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-success'
    });
    modalRef.componentInstance.title = user.name;
    modalRef.componentInstance.url = UsersController.Unlock(user.id);
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

  openOrderSlider(content: TemplateRef<any>, selectedUser: any) {
    this.previewUser = selectedUser;
    console.log(this.previewUser);
    this.offcanvasService.open(content, { position: 'end' });
  }

  updateUser() {
    this.tableService.loadData(undefined, true).subscribe(res => {
      if(this.previewUser == null) return;
      this.previewUser = this.tableService.data.filter(x => x.id == this.previewUser.id)[0];
    })
  }
}


