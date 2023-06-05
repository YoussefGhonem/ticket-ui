import { BaseComponent } from '@shared/base/base.component';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SettingsController } from 'app/+settings/controllers';
import * as saveAs from 'file-saver';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ngbModalOptions } from '@shared/default-values';
import { filesService } from '@shared/services';
import { SettingsValidator } from "app/+settings/validators/settings.validators";
import { CustomPdfViewerComponent } from "@libs/custom-pdf-viewer/custom-pdf-viewer.component";

@Component({
  selector: 'app-verification-file',
  templateUrl: './verification-file.component.html',
  styleUrls: ['./verification-file.component.scss']
})
export class VerificationFileComponent extends BaseComponent implements OnInit, OnChanges {

  @Input('settings') settings: any;
  @Output() loadSettings = new EventEmitter();
  file: File;
  uploadedFileSubmit: boolean = false;
  verificationFileForm!: UntypedFormGroup;

  constructor(
    public override injector: Injector,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private _formBuilder: UntypedFormBuilder,
    public _imagesService: filesService,
  ) {
    super(injector);
  }
  ngOnChanges(changes: SimpleChanges): void {
    
  }


  ngOnInit() {
    this.verificationFileForm = this._formBuilder.group({
      verificationDocument: ['', SettingsValidator.verificationDocument]
    });
  }

  onFileChange(event, fileTag) {
    const file = event.target.files[0] as File;
    if (!file || !this._imagesService.isValidPdfExtension(file)) {
      this.notificationService.error("Invalid file format", "File extension should be .pdf.");
      this.verificationFileForm.reset();
      return
    }

    let reader = new FileReader();
    reader.onloadend = () => {
      fileTag.src = reader.result;
    };

    this.file = file;
    console.log(file);
  }

  get form() {
    return this.verificationFileForm.controls;
  }

  onFileSubmit() {
    this.uploadedFileSubmit = true;
    if (this.verificationFileForm.invalid) {
      return;
    }
    let body = this.verificationFileForm.getRawValue();
    body.verificationDocument = this.file;
    this.httpService.PUT(SettingsController.VerificationDocument, this.httpService.objectToFormData(body), undefined)
      .subscribe(() => {
        this.notificationService.success('File Uploaded', 'The verification document is uploaded successfully! 🎉');
        this.loadSettings.emit();
      });
  }

  showPdf() {
    const modalRef = this.modalService.open(CustomPdfViewerComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-success',
      size: 'xl'
    });
    modalRef.componentInstance.src = this.settings.verificationDocumentUrl;
    modalRef.componentInstance.title = this.settings.verificationDocumentName.split('.').slice(0, -1).join('.');
    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true))
      .catch(() => {
      });
  }

  downloadPdf() {
    this.httpService.Download(this.settings.verificationDocumentUrl)
      .subscribe((file) => {
        saveAs(file, 'Verification Document.pdf');
      });
  }

}
