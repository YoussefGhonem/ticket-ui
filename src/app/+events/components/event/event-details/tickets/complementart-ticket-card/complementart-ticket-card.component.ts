import { DeleteComponent } from '@shared/components/delete/delete.component';
import { UpdateComplementaryComponent } from './../update-complementary/update-complementary.component';
import { BaseComponent } from '@shared/base/base.component';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { EventAllowedActions, TicketTypeAllowedActions, TicketTypeModel } from 'app/+events/models';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ngbModalOptions } from '@shared/default-values';
import { ComplementaryTicketController } from 'app/+events/controllers/ComplementaryTicketController';
import { IncreaseQuantityComponent } from '../increase-quantity/increase-quantity.component';
import { InviteNewClientsComponent } from '../invite-new-clients/invite-new-clients.component';

@Component({
  selector: 'complementart-ticket-card',
  templateUrl: './complementart-ticket-card.component.html',
  styleUrls: ['./complementart-ticket-card.component.scss']
})

export class ComplementaryTicketCardComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() ticketType: TicketTypeModel;
  @Input() eventId: string;
  @Output() loadComplementary = new EventEmitter();
  @Output() loadData = new EventEmitter();
  complementaryAllowedAction = TicketTypeAllowedActions;
  @Input() eventAllowedActions: EventAllowedActions[];
  eventAllowedAction = EventAllowedActions;

  constructor(
    public override injector: Injector,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal) { super(injector); }

  ngOnChanges(): void {
  }

  ngOnInit(): void {
  }

  showProgress() {
    return this.ticketType?.totalTickets > 0;
  }

  hasAllowedAction(action: TicketTypeAllowedActions) {
    return this.ticketType?.allowedActions?.includes(action);
  }
  hasEventAllowedAction(action: EventAllowedActions){
    return this.eventAllowedActions?.includes(action);
  }

  updateComplementary() {
    const modalRef = this.modalService.open(UpdateComplementaryComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-primary',
      size: 'md'
    });
    modalRef.componentInstance.complementary = this.ticketType;
    modalRef.componentInstance.eventId = this.eventId;

    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.loadComplementary.emit();
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

    modalRef.componentInstance.title = "Complementary Ticket";
    modalRef.componentInstance.url = ComplementaryTicketController.DeleteComplementary(this.eventId);

    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.loadComplementary.emit();
          this.loadData.emit();
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
          this.loadComplementary.emit();
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
          this.loadComplementary.emit();
          this.activeModal.close(true);
        }
      })
      .catch(() => {
      });
  }


  presentDate(date: string){
    let newDate = new Date(date);
    return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
  }


}
