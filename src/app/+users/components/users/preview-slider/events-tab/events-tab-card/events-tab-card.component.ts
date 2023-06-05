import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { DeleteComponent } from '@shared/components/delete/delete.component';
import { ngbModalOptions } from '@shared/default-values';
import { EventsController } from 'app/+events/controllers';
import { EventAllowedActions, EventStatusEnum } from 'app/+events/models/enum';

@Component({
  selector: 'events-tab-card',
  templateUrl: './events-tab-card.component.html',
  styleUrls: ['./events-tab-card.component.scss']
})
export class EventsTabCardComponent extends BaseComponent implements OnInit, OnChanges {
  @Input('events') events: any[];
  @Output('notify') notify = new EventEmitter<boolean>();

  cssClass: string
  eventStatusEnum = EventStatusEnum;
  allowedActions = EventAllowedActions

  constructor(
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public override injector: Injector,
    private router: Router) {
    super(injector);
  }

  ngOnChanges(): void {

  }

  ngOnInit(): void {
  }

  hasAllowedAction(event: any, action: EventAllowedActions): boolean {
    let allowedActions = event?.allowedActions as Array<EventAllowedActions>
    return allowedActions?.includes(action);
  }

  remove(item) {
    const modalRef = this.modalService.open(DeleteComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-danger'
    });
    modalRef.componentInstance.title = item.name;
    modalRef.componentInstance.url = EventsController.Delete(item.id);
    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.notify.emit())
      .catch(() => {
      });
  }

  getBackGroundColor(data) {
    switch (data) {
      case EventStatusEnum[EventStatusEnum.Draft]:
        return 'dark';
      case EventStatusEnum[EventStatusEnum.Published]:
        return 'success';
      case EventStatusEnum[EventStatusEnum.Ended]:
        return 'primary';
      default:
        return 'danger';
    }
  }

  getDetails(id: string) {
    this.router.navigate([`/events/${id}`], 
      {
        queryParams: {
          activeId: 1
        }
      }
    )
  }
}
