import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileViewerComponent } from "@libs/file-viewer/file-viewer.component";
import { CommonModule } from "@angular/common";


@NgModule({
  imports: [
    PdfViewerModule,
    NgbModule,
    CommonModule
  ],
  declarations: [
    FileViewerComponent
  ],
  exports: [
    FileViewerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FileViewerModule {
}
