import { EventAllowedActions } from 'app/+events/models';
import { TicketTypeAllowedActions } from 'app/+events/models';
import { UpdateTicketTypeComponent } from './../update-ticket-type/update-ticket-type.component';
import { TicketTypesController } from 'app/+events/controllers';
import { TicketTypeModel } from 'app/+events/models';
import { BaseComponent } from '@shared/base/base.component';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteComponent } from '@shared/components/delete/delete.component';
import { ngbModalOptions } from '@shared/default-values';
import { IncreaseQuantityComponent } from '../increase-quantity/increase-quantity.component';
import { InviteNewClientsComponent } from '../invite-new-clients/invite-new-clients.component';

@Component({
  selector: 'ticket-card',
  templateUrl: './ticket-card.component.html',
  styleUrls: ['./ticket-card.component.scss']
})

export class TicketCardComponent extends BaseComponent implements OnInit, OnChanges {

  @Input('ticketType') ticketType: TicketTypeModel;
  @Input('eventId') eventId: string;
  @Input('percentage') percentage: number;
  @Output('notify') notify = new EventEmitter();
  @Output('loadEvent') loadEvent = new EventEmitter();

  ticketTypeAllowedAction = TicketTypeAllowedActions;

  @Input() eventAllowedActions: EventAllowedActions[];
  eventAllowedAction = EventAllowedActions;

  constructor(
    public override injector: Injector,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }

  onClickUpdate() {
    const modalRef = this.modalService.open(UpdateTicketTypeComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-primary',
      size: 'md'
    });
    modalRef.componentInstance.ticketType = this.ticketType;
    modalRef.componentInstance.eventId = this.eventId;
    modalRef.componentInstance.percentage = this.percentage;

    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.notify.emit();
          this.activeModal.close(true);
        }
      })
      .catch(() => {
      });
  }

  onClickDelete() {
    const modalRef = this.modalService.open(DeleteComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-primary',
      size: 'md'
    });

    modalRef.componentInstance.title = this.ticketType?.title;
    modalRef.componentInstance.url = TicketTypesController.DeleteEventTicketType(this.eventId, this.ticketType?.id);

    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.notify.emit();
          this.loadEvent.emit();
          this.activeModal.close(true);
        }
      })
      .catch(() => {
      });
  }

  onClickShowIncreaseQuantity() {
    const modalRef = this.modalService.open(IncreaseQuantityComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-primary',
      size: 'md'
    });
    modalRef.componentInstance.ticketType = this.ticketType;
    modalRef.componentInstance.eventId = this.eventId;

    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.notify.emit();
          this.activeModal.close(true);
        }
      })
      .catch(() => {
      });
  }

  onClickShowInviteNewClients() {
    const modalRef = this.modalService.open(InviteNewClientsComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-primary',
      size: 'md'
    });
    modalRef.componentInstance.ticketType = this.ticketType;
    modalRef.componentInstance.eventId = this.eventId;

    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.notify.emit();
          this.activeModal.close(true);
        }
      })
      .catch(() => {
      });
  }

  hasTicketTypeAllowedAction(action: TicketTypeAllowedActions) {
    return this.ticketType?.allowedActions?.includes(action);
  }

  hasEventAllowedAction(action: EventAllowedActions) {
    return this.eventAllowedActions?.includes(action);
  }

  presentDate(date: string) {
    let newDate = new Date(date);
    return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
  }

}
