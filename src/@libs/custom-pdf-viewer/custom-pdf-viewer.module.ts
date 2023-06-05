import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CustomPdfViewerComponent } from "@libs/custom-pdf-viewer/custom-pdf-viewer.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    PdfViewerModule,
    NgbModule
  ],
  declarations: [
    CustomPdfViewerComponent
  ],
  exports: [
    CustomPdfViewerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomPdfViewerModule {
}
