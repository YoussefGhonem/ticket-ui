import { Component, Injector, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { FileTypeEnum } from "app/+events/models";

@Component({
  selector: 'file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.scss'],
})
export class FileViewerComponent extends BaseComponent {

  @Input() name: string;
  @Input() url: string;
  @Input() size: number;
  @Input() type: FileTypeEnum;

  fileTypeEnum = FileTypeEnum;

  constructor(
      public modalService: NgbActiveModal,
      public override injector: Injector,
  ) {
    super(injector);
  }

}
