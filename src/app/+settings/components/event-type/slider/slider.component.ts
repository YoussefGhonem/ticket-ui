import { RolesEnum } from './../../../../+auth/models/enums';
import { BaseComponent } from '@shared/base/base.component';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { EventTypesController } from 'app/+settings/controllers';
import { EventTypeAllowedActions } from 'app/+settings/models';
import { DeleteComponent } from '@shared/components/delete/delete.component';
import { ngbModalOptions } from '@shared/default-values';
import { ActivateComponent } from '@shared/components/activate/activate.component';
import { DeactivateComponent } from '@shared/components/deactivate/deactivate.component';
import { AddEditEventTypeComponent } from '../add-edit-event-type/add-edit-event-type.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})

export class EventTypeSliderComponent extends BaseComponent implements OnInit, OnChanges {

  @Input('eventType') eventType: any = null;
  @Output('loadEventTypes') loadEventTypes = new EventEmitter<string>();
  allowedAction = EventTypeAllowedActions;
  eventTypeAudits: any[] = [];
  currentFilters: object = null;
  activeId: number = 1;
  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
      public override injector: Injector
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.eventType);
  }

  ngOnInit(): void {
  }

  loadEventTypeAudits(filters: any = null): void {
    this.currentFilters = filters ?? this.currentFilters;
    this.httpService.GET(EventTypesController.GetEventTypeAudits(this.eventType.id), this.currentFilters)
      .subscribe(res => {
        console.log(res);
        this.eventTypeAudits = res?.data.length == 0 ? this.eventTypeAudits : this.eventTypeAudits.concat(res?.data);
      })
  }

  loadEventTypeAuditsForFirstTime(filters: any = null): void {
    this.currentFilters = filters ?? this.currentFilters;
    this.httpService.GET(EventTypesController.GetEventTypeAudits(this.eventType.id), this.currentFilters)
      .subscribe(res => {
        console.log(res);
        this.eventTypeAudits = res?.data.length == 0 ? [] : res?.data;
      })
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
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || (this.loadEventTypes.emit('delete')) || this.loadEventTypeAuditsForFirstTime())
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
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || (this.loadEventTypes.emit('delete')) || this.loadEventTypeAuditsForFirstTime())
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
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || (this.loadEventTypes.emit('delete')) || this.loadEventTypeAuditsForFirstTime())
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
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || (this.loadEventTypes.emit('delete')) || this.loadEventTypeAuditsForFirstTime())
      .catch(() => {
      });
  }

}
