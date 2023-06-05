import { RolesEnum } from 'app/+auth/models';
import { UploadAttachmentsComponent } from './upload-attachments/upload-attachments.component';
import { FileTypeEnum, EventAttahcmentAllowedActions, EventAllowedActions } from 'app/+events/models';
import { EventsController } from 'app/+events/controllers';
import { ActivatedRoute } from '@angular/router';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';
import { EventAttachmentModel } from 'app/+events/models';
import * as saveAs from 'file-saver';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ngbModalOptions } from '@shared/default-values';
import { DeleteComponent } from '@shared/components/delete/delete.component';
import { FileViewerComponent } from "@libs/file-viewer/file-viewer.component";

@Component({
  selector: 'app-event-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class EventAttachmentsComponent extends BaseComponent implements OnInit {

  @Input() eventAllowedAction: EventAllowedActions[];

  form: UntypedFormGroup;
  eventId: string;
  attachments: EventAttachmentModel[];
  fileTypeEnum = FileTypeEnum;
  eventAttachmentAllowedActions = EventAttahcmentAllowedActions;
  allowedActions = EventAllowedActions;

  constructor(
    public override injector: Injector,
    private _router: ActivatedRoute,
    private _formBuilder: UntypedFormBuilder,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getEventIdFromQuery();
    this.initializeForm();
    this.loadAttachments();
  }

  getEventIdFromQuery() {
    this._router.paramMap
      .subscribe(params => {
        this.eventId = params.get('id');
      });
  }

  initializeForm() {
    this.form = this._formBuilder.group({
      files: new FormControl(null)
    });
  }

  loadAttachments() {
    this.httpService.GET(EventsController.GetEventAttachments(this.eventId))
      .subscribe(res => {
        this.attachments = res;
        console.log(this.attachments);
      })
  }

  download(index: number) {
    this.httpService.Download(this.attachments[index].url)
      .subscribe((file) => {
        saveAs(file, this.attachments[index].name);
      });
  }

  onClickUpload() {
    const modalRef = this.modalService.open(UploadAttachmentsComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-primary',
      size: 'md'
    });
    modalRef.componentInstance.attachments = this.attachments;
    modalRef.componentInstance.eventId = this.eventId;

    modalRef
      .result
      .then((actionCompleted: boolean) => {
        if (actionCompleted) {
          this.loadAttachments();
          this.activeModal.close(true);
        }
      })
      .catch(() => {
      });
  }

  hasAllowedAction(item: EventAttachmentModel, action: EventAttahcmentAllowedActions) {
    return item?.allowedActions?.includes(action);
  }
  eventHasAllowedAction(action: EventAllowedActions): boolean {
    let allowedActions = this.eventAllowedAction as Array<EventAllowedActions>
    return allowedActions?.includes(action);
  }
  hasPermission() {
    return this.currentUser?.roles.includes(RolesEnum[RolesEnum.Vendor]) ||
      this.currentUser?.roles.includes(RolesEnum[RolesEnum.VendorAdmin]);
  }

  deleteAttachment(attachment: EventAttachmentModel) {
    const modalRef = this.modalService.open(DeleteComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-danger'
    });
    modalRef.componentInstance.title = attachment.name;
    modalRef.componentInstance.url = EventsController.DeleteAttachment(this.eventId, attachment.id);

    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true) || this.loadAttachments())
      .catch(() => {
      });
  }

  viewFile(attachment: EventAttachmentModel) {
    const modalRef = this.modalService.open(FileViewerComponent, {
      // ...ngbModalOptions,
    });
    modalRef.componentInstance.url = attachment.url;
    modalRef.componentInstance.size = attachment.size;
    modalRef.componentInstance.name = attachment.name;
    modalRef.componentInstance.type = attachment.type;
  }

}
