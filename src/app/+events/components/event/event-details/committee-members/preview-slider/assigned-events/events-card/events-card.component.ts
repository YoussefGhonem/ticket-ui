import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "@shared/base/base.component";
import { DeleteComponent } from "@shared/components/delete/delete.component";
import { ngbModalOptions } from "@shared/default-values";
import { CancelEventComponent } from "app/+events/components/event/cancel-event/cancel-event.component";
import { PublishEventComponent } from "app/+events/components/event/publish-event/publish-event.component";
import { EventsController } from "app/+events/controllers";
import { EventStatusEnum, EventAllowedActions } from "app/+events/models";

@Component({
  selector: "member-events-card",
  templateUrl: "./events-card.component.html",
  styleUrls: ["./events-card.component.scss"],
})
export class MemberEventsCardComponent
  extends BaseComponent
  implements OnInit, OnChanges
{
  @Input("events") events: any[];
  @Output("notify") notify = new EventEmitter<boolean>();

  cssClass: string;
  eventStatusEnum = EventStatusEnum;
  allowedActions = EventAllowedActions;

  constructor(
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public override injector: Injector
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {}
  ngOnInit(): void {

    console.log("Card events : ",this.events)

  }
  hasAllowedAction(event: any, action: EventAllowedActions): boolean {
    let allowedActions = event?.allowedActions as Array<EventAllowedActions>;
    return allowedActions?.includes(action);
  }

  remove(item) {
    const modalRef = this.modalService.open(DeleteComponent, {
      ...ngbModalOptions,
      windowClass: "modal modal-danger",
    });
    modalRef.componentInstance.title = item.name;
    modalRef.componentInstance.url = EventsController.Delete(item.id);
    modalRef.result
      .then(
        (actionCompleted: boolean) =>
          !actionCompleted || this.activeModal.close(true) || this.notify.emit()
      )
      .catch(() => {});
  }

  cancel(item) {
    const modalRef = this.modalService.open(CancelEventComponent, {
      ...ngbModalOptions,
      windowClass: "modal modal-danger",
    });
    modalRef.componentInstance.title = item.name;
    modalRef.componentInstance.url = EventsController.Cancel(item.id);
    modalRef.result
      .then(
        (actionCompleted: boolean) =>
          !actionCompleted || this.activeModal.close(true) || this.notify.emit()
      )
      .catch(() => {});
  }

  publish(item) {
    const modalRef = this.modalService.open(PublishEventComponent, {
      ...ngbModalOptions,
      windowClass: "modal modal-success",
    });
    modalRef.componentInstance.title = item.name;
    modalRef.componentInstance.url = EventsController.Publish(item.id);
    modalRef.result
      .then(
        (actionCompleted: boolean) =>
          !actionCompleted || this.activeModal.close(true) || this.notify.emit()
      )
      .catch(() => {});
  }

  getBackGroundColor(data) {
    switch (data) {
      case EventStatusEnum[EventStatusEnum.Draft]:
        return "dark";
      case EventStatusEnum[EventStatusEnum.Published]:
        return "success";
      case EventStatusEnum[EventStatusEnum.Ended]:
        return "primary";
      default:
        return "danger";
    }
  }
}
