import { ActivatedRoute, Router } from "@angular/router";
import { UpdateEventBasicInfoComponent } from "./../update-basic-info/update-basic-info.component";
import { Event } from "app/+events/models/event.model";
import { EventAllowedActions, EventStatusEnum } from "app/+events/models/enum";
import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { BaseComponent } from "@shared/base/base.component";
import { ngbModalOptions } from "@shared/default-values";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeleteComponent } from "@shared/components/delete/delete.component";
import { EventsController } from "app/+events/controllers";
import { CancelEventComponent } from "../../cancel-event/cancel-event.component";
import { PublishEventComponent } from "../../publish-event/publish-event.component";
import { PostponeEnventComponent } from "./postpone-envent/postpone-envent.component";

@Component({
  selector: "app-event-details-basic-info",
  templateUrl: "./basic-info.component.html",
  styleUrls: ["./basic-info.component.scss"],
})
export class EventBasicInfoComponent extends BaseComponent implements OnInit {
  @Input() eventBasicInfo: Event;

  @Output() loadDate = new EventEmitter();
  @Output("loadActivities") loadActivities = new EventEmitter();

  eventId: string;

  editMode: boolean = false;
  eventStatus = EventStatusEnum;
  allowedActions = EventAllowedActions;
  constructor(
    public override injector: Injector,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal
  ) {
    super(injector);
  }

  hasAllowedAction(action: EventAllowedActions): boolean {
    let allowedActions = this.eventBasicInfo
      ?.allowedActions as Array<EventAllowedActions>;
    return allowedActions?.includes(action);
  }

  ngOnInit(): void {
    this.getEventIdFromQuery();
  }

  getEventIdFromQuery() {
    this.activatedRoute.paramMap.subscribe((params) => {
      console.log(params);
      this.eventId = params.get("id");
    });
  }

  loadActivitiesEvent() {
    this.loadActivities.emit();
  }

  remove() {
    const modalRef = this.modalService.open(DeleteComponent, {
      ...ngbModalOptions,
      windowClass: "modal modal-danger",
    });
    modalRef.componentInstance.title = this.eventBasicInfo.name;
    modalRef.componentInstance.url = EventsController.Delete(
      this.eventBasicInfo.id
    );
    modalRef.result
      .then((actionCompleted: boolean) => {
        this.loadActivitiesEvent();
        return (
          !actionCompleted ||
          this.activeModal.close(true) ||
          this.router.navigate(["/events"])
        );
      })
      .catch(() => {});
  }

  cancel() {
    const modalRef = this.modalService.open(CancelEventComponent, {
      ...ngbModalOptions,
      windowClass: "modal modal-danger",
    });
    modalRef.componentInstance.title = this.eventBasicInfo.name;
    modalRef.componentInstance.url = EventsController.Cancel(
      this.eventBasicInfo.id
    );
    modalRef.result
      .then((actionCompleted: boolean) => {
        this.loadActivitiesEvent();
        return (
          !actionCompleted ||
          this.activeModal.close(true) ||
          this.loadDate.emit() ||
          this.router.navigate(["/events"])
        );
      })
      .catch(() => {});
  }

  postpone() {
    const modalRef = this.modalService.open(PostponeEnventComponent, {
      ...ngbModalOptions,
      windowClass: "modal modal-primary",
      size: "md",
    });
    modalRef.componentInstance.title = this.eventBasicInfo.name;
    modalRef.componentInstance.url = EventsController.Postpone(
      this.eventBasicInfo.id
    );
    modalRef.componentInstance.eventBasicInfo = this.eventBasicInfo;

    modalRef.result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) this.loadActivitiesEvent();
        return (
          !actionCompleted ||
          this.activeModal.close(true) ||
          this.loadDate.emit()
        );
      })
      .catch(() => {});
  }

  publish() {
    const modalRef = this.modalService.open(PublishEventComponent, {
      ...ngbModalOptions,
      windowClass: "modal modal-success",
    });
    modalRef.componentInstance.title = this.eventBasicInfo.name;
    modalRef.componentInstance.url = EventsController.Publish(
      this.eventBasicInfo.id
    );
    modalRef.result
      .then((actionCompleted: boolean) => {
        this.loadActivitiesEvent();
        return (
          !actionCompleted ||
          this.activeModal.close(true) ||
          this.loadDate.emit()
        );
      })
      .catch(() => {});
  }

  onEditClick() {
    this.editMode = true;
    const modalRef = this.modalService.open(UpdateEventBasicInfoComponent, {
      ...ngbModalOptions,
      windowClass: "modal modal-primary",
      size: "md",
    });
    modalRef.componentInstance.eventBasicInfo = this.eventBasicInfo;
    modalRef.componentInstance.eventId = this.eventId;

    modalRef.result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.loadActivitiesEvent();
          this.loadDate.emit();
          this.activeModal.close(true);
        }
      })
      .catch(() => {});

    this.editMode = false;
  }
}
