import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadFilesComponent } from "./upload-files.component";
import { DropzoneDirective } from "./dropzone.directive";
import { CommonModule } from "@angular/common";
import { FormatFileSizePipe } from "./format-file-size.pipe";
import { FilesService } from "./files.service";

@NgModule({
  imports: [
    NgbModule,
    CommonModule
  ],
  declarations: [
    UploadFilesComponent,
    DropzoneDirective,
    FormatFileSizePipe
  ],
  exports: [
    UploadFilesComponent,
    FormatFileSizePipe
  ],
  providers: [FilesService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UploadFilesModule {
}
