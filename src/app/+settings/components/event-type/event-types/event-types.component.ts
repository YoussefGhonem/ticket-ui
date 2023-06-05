import { ActivateComponent } from '@shared/components/activate/activate.component';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Component, Injector, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '@shared/base/base.component';
import { EventTypesController } from 'app/+settings/controllers';
import { NgbActiveModal, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import {
  AddEditEventTypeComponent
} from 'app/+settings/components/event-type/add-edit-event-type/add-edit-event-type.component';
import { ngbModalOptions } from '@shared/default-values';
import { DeleteComponent } from "@shared/components/delete/delete.component";
import { DeactivateComponent } from '@shared/components/deactivate/deactivate.component';
import { EventTypeAllowedActions } from 'app/+settings/models';
import { TableColumn } from "@libs/primeng-table/models/table-column.model";
import { TableDataAdapterService } from "@libs/primeng-table/services/table-data-adapter.service";
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-event-types',
  templateUrl: './event-types.component.html',
  styleUrls: ['./event-types.component.scss']
})
export class EventTypesComponent extends BaseComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  form!: FormGroup;
  allowedAction = EventTypeAllowedActions;
  columns: TableColumn<any>[] = [];
  previewEventType: any;

  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public override injector: Injector,
    private _formBuilder: FormBuilder,
    public tableService: TableDataAdapterService,
    private offcanvasService: NgbOffcanvas) {
    super(injector);

    this.columns = [
      { title: 'Name', field: 'name', type: 'text', visible: true, allowSorting: true },
      { title: 'Status', field: 'isActive', type: 'custom', visible: true, allowSorting: true },
      { title: 'Description', field: 'description', type: 'text', visible: true, allowSorting: true },
      { title: 'Created Date', field: 'createdDate', type: 'datetime', visible: true, allowSorting: true },
      { title: 'Created By', field: 'createdByName', type: 'text', visible: true, allowSorting: false },
      { title: 'Actions', field: 'actions', type: 'custom', visible: true, allowSorting: false },

    ];
    this.initSearchForm();
    this.tableService.setupTable(EventTypesController.EventTypes, this.columns, this.form?.getRawValue());
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Settings' },
      { label: 'Event Types', active: true }
    ];
  }

  clearSearchBar() {
    this.form.controls['name'].reset();
  }
  showDeleteIcon(): boolean {
    if (this.form.get('name').value == null) return false
    else if (this.form.get('name').value?.trim().length != 0) return true;
    return false;
  }

  export() {
    let body = this.getBody();
    this.httpService.ExportExcel(EventTypesController.ExportToExcel, body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .toPromise()
      .then((data: any) => {
        saveAs(data, `Event Types.xlsx`);
      });
  }

  getBody() {
    let columns = this.tableService.selectedColumns.filter(x => x.visible && x.field != 'actions').map(x => x.field);
    this.form.controls['columns'].patchValue(columns)
    this.form.controls['sortField']?.patchValue(this.tableService?.pagingAndSorting?.sortField)
    this.form.controls['sortOrder']?.patchValue(this.tableService?.pagingAndSorting?.sortOrder)

    let body = this.form.getRawValue();
    if (this.form?.controls['isActive'].value == null || this.form?.controls['isActive'].value == '')
      body.isActive = null;
    if (this.form?.controls['isActive'].value == 'true')
      body.isActive = true;
    if (this.form?.controls['isActive'].value == 'false')
      body.isActive = false;

    return body;
  }

  private initSearchForm(): void {
    this.form = this._formBuilder.group({
      name: new FormControl(null),
      isActive: new FormControl(''),
      // for export
      sortField: new FormControl(null),
      sortOrder: new FormControl(null),
      columns: [],
      currentTimeZoneDifferenceInMinutes: new FormControl((new Date()).getTimezoneOffset())
    });

    this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe(res => {
        this.tableService.loadData(this.form.getRawValue(), true).subscribe();
      });
  }

  add(event) {
    const modalRef = this.modalService.open(AddEditEventTypeComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-success'
    });
    modalRef.componentInstance.mode = 'add';
    modalRef.componentInstance.formFilters = this.form;
    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.tableService.loadData(undefined, true).subscribe())
      .catch(() => {
      });
  }

  hasAllowedAction(eventType: any, action: EventTypeAllowedActions) {
    // return eventType?.allowedActions.includes(EventTypeAllowedActions[action]);
    return eventType?.allowedActions?.includes(action);
  }

  delete(item: any) {
    const modalRef = this.modalService.open(DeleteComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-danger'
    });
    modalRef.componentInstance.title = item.name;
    modalRef.componentInstance.url = EventTypesController.Delete(item.id);
    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.tableService.loadData(undefined, true).subscribe())
      .catch(() => {
      });
  }

  activate(item: any) {
    const modalRef = this.modalService.open(ActivateComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-success'
    });
    modalRef.componentInstance.title = item.name;
    modalRef.componentInstance.url = EventTypesController.Activate(item.id);
    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.tableService.loadData(undefined, true).subscribe())
      .catch(() => {
      });
  }

  deactivate(item: any) {
    const modalRef = this.modalService.open(DeactivateComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-danger'
    });
    modalRef.componentInstance.title = item.name;
    modalRef.componentInstance.url = EventTypesController.Deactivate(item.id);
    modalRef.componentInstance.reason = true;
    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.tableService.loadData(undefined, true).subscribe())
      .catch(() => {
      });
  }

  edit(eventType: any) {
    const modalRef = this.modalService.open(AddEditEventTypeComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-success'
    });
    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.eventType = eventType;
    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.tableService.loadData().subscribe())
      .catch(() => {
      });
  }

  get disabledExport(): boolean {
    let columns = this.tableService?.selectedColumns.filter(x => x.visible && x.field != 'actions')
    if (columns?.length == 1 && columns?.map(x => x.field).includes('actions')) return true;
    return this.tableService?.dataList?.length == 0 || columns?.length == 0
  }

  openOrderSlider(content: TemplateRef<any>, selectedEventType: any) {
    this.previewEventType = selectedEventType;
    console.log(this.previewEventType);
    this.offcanvasService.open(content, { position: 'end' });
  }

  loadData() {
    this.tableService.loadData(undefined, true)
      .subscribe(res => {
        this.previewEventType = this.tableService.data.filter(x => x.id == this.previewEventType.id)[0];
        console.log(this.tableService.data);
      })
  }

  afterAction(event: any, offCanvas: any) {
    this.loadData();
    if(event == 'delete'){
      offCanvas.dismiss('Cross click');
    }
  }
}

