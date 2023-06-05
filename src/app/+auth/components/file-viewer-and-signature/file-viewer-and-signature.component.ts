import { UntypedFormGroup } from '@angular/forms';
import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as saveAs from 'file-saver';

@Component({
  selector: 'file-viewer-and-signature',
  templateUrl: './file-viewer-and-signature.component.html',
  styleUrls: ['./file-viewer-and-signature.component.scss'],
})
export class FileViewerAndSignatureComponent extends BaseComponent {

  @Input() title: string = 'PDF Viewer';
  @Input() src: string;
  @Input('signupForm') signupForm: UntypedFormGroup;
  signature: string;


  constructor(
    public modalService: NgbActiveModal,
    public override injector: Injector,
  ) {
    super(injector);
  }

  downloadPdf() {
    this.httpService.Download(this.src)
      .subscribe((file) => {
        saveAs(file, 'Verification Document.pdf');
      });
  }


  saveSignature(signature: any) {
      this.signupForm.get('signature').patchValue(signature);
      this.modalService.close();
  }

  clearSignature() {
    this.signupForm.get('signature').patchValue(null);
  }
}
