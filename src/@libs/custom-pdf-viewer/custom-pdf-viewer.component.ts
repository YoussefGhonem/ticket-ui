import { Component, Injector, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import * as saveAs from 'file-saver';

@Component({
  selector: 'custom-pdf-viewer',
  templateUrl: './custom-pdf-viewer.component.html',
  styleUrls: ['./custom-pdf-viewer.component.scss'],
})
export class CustomPdfViewerComponent extends BaseComponent {

  @Input() title: string = 'PDF Viewer';
  @Input() src: string;

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
}
