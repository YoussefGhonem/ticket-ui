import { EventsController } from 'app/+events/controllers';
import { EventAttachmentModel, FileTypeEnum } from 'app/+events/models';
import { BaseComponent } from '@shared/base/base.component';
import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { filesService } from '@shared/services';
import { UploadFilesComponent } from "@libs/upload-files/upload-files.component";

@Component({
  selector: 'upload-attachments',
  templateUrl: './upload-attachments.component.html',
  styleUrls: ['./upload-attachments.component.scss']
})

export class UploadAttachmentsComponent extends BaseComponent implements OnInit, OnChanges {

  @ViewChild(UploadFilesComponent, { static: true }) public uploadFilesComponent: UploadFilesComponent;
  form: UntypedFormGroup;
  fileTypeEnum = FileTypeEnum;

  @Input() eventId: string;
  @Input() attachments: EventAttachmentModel[];
  @Output() loadAttachments = new EventEmitter();

  constructor(
    public override injector: Injector,
    public modalService: NgbActiveModal,
    private formBuilder: FormBuilder,
    public _imagesService: filesService
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.initializeForm();
    console.log(this.attachments);
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      files: []
    });
  }

  get Attachments(): File[] {
    return this.uploadFilesComponent?.allFiles;
  }

  submit(): any {
    if (this.form.invalid) {
      return;
    }
    let body = this.form.getRawValue();
    body.files = this.Attachments;

    this.httpService.PUT(EventsController.UploadAttachments(this.eventId), this.httpService.objectToFormData(body))
      .subscribe(res => {
        this.modalService.close(true);
        this.notificationService.success('Update Attachments', 'Your changes successfully updated! 🎉');
        this.loadAttachments.emit();
      });
  }


}
