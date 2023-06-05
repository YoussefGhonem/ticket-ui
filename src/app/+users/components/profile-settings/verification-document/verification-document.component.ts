import { RolesEnum } from 'app/+auth/models';
import { VendorsController } from './../../../../+vendors/controllers/VendorsController';
import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input, OnInit } from "@angular/core";
import { ngbModalOptions } from '@shared/default-values';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { CustomPdfViewerComponent } from "@libs/custom-pdf-viewer/custom-pdf-viewer.component";
import { SettingsController } from "app/+settings/controllers";

@Component({
  selector: 'verification-document',
  templateUrl: './verification-document.component.html',
  styleUrls: ['./verification-document.component.scss']
})

export class VerificationTabComponent extends BaseComponent implements OnInit {

  @Input() signatureImage: string = '';
  verificationDocument: any;

  constructor(
    public override injector: Injector,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getVerificationDocument();
  }

  getVerificationDocument() {
    if (this.currentUser?.roles.includes(RolesEnum[RolesEnum.Vendor]) == false) {
      this.verificationDocument = null;
      return;
    }
    this.httpService.GET(VendorsController.GetVendorVerificationDocument)
      .subscribe((verificationDocument) => {
        console.log(verificationDocument);
        this.verificationDocument = verificationDocument;
      });
  }

  showPdf() {
    const modalRef = this.modalService.open(CustomPdfViewerComponent, {
      ...ngbModalOptions,
      windowClass: 'modal modal-success',
      size: 'xl'
    });
    modalRef.componentInstance.src = this.verificationDocument.url;
    modalRef
      .result
      .then((actionCompleted: boolean) => !actionCompleted || this.activeModal.close(true))
      .catch(() => {
      });
  }

  downloadPdf() {
    this.httpService.Download(this.verificationDocument.url)
      .subscribe((file) => {
        saveAs(file, 'VerificationDocument.pdf');
      });
  }

}
