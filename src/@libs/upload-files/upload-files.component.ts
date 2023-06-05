import { FileTypeEnum } from 'app/+events/models';
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { FilesService } from "@libs/upload-files/files.service";
import { AfterUploadSuccessEnum, OnUploadFailedEnum, UploadFilesOptions } from "@libs/upload-files/models";
import { NotificationService } from "@shared/services";

@Component({
  selector: 'upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss'],
})
export class UploadFilesComponent {

  @Input('options') options: UploadFilesOptions = new UploadFilesOptions();
  @ViewChild('files') input!: ElementRef;

  allFiles: File[] = [];

  constructor(private filesService: FilesService, private notificationService: NotificationService) {
  }

  droppedFiles(allFiles: File[]): void {

    if (this.options.afterUploadSuccess == AfterUploadSuccessEnum.ResetTheFiles) {
      this.allFiles = [];
    }

    if (this.options.onUploadFailed == OnUploadFailedEnum.DoNotUploadAnyFiles) {
      const invalidFiles = Array.from(allFiles)
          .map(file => this.filesService.validateFile(file, this.options))
          .filter(result => !result.isValid);
      if (invalidFiles.length > 0) {
        this.notificationService.error('', invalidFiles.map(x => x.errors).join(', '));
        return;
      }
    }

    for (let i = 0; i < allFiles.length; i++) {
      const file = allFiles[i];

      const result = this.filesService.validateFile(file, this.options);
      if (!result.isValid) continue;

      this.allFiles.push(file);
    }

    if (this.options.onUploadFailed == OnUploadFailedEnum.UploadOnlyValidFilesAndSkipInvalidFiles) {
      const invalidFiles = Array.from(allFiles)
          .map(file => this.filesService.validateFile(file, this.options))
          .filter(result => !result.isValid);
      if (invalidFiles.length > 0) {
        this.notificationService.error('', invalidFiles.map(x => x.errors).join(', '));
        return;
      }
    }

    // (<HTMLInputElement>document.getElementById('files')).value = null;
  }

  resetInput() {
    this.input.nativeElement.value = null;
  }

  removeFile(index: number) {
    this.allFiles.splice(index, 1);
  }

  getFilesFromEvent(event: any): File[] {
    return event.target.files as File[];
  }

  getFileIcon(file: File): string {
    if (file.type.includes('audio/')) return 'ri-music-2-fill text-warning';
    else if (file.type.includes('video/')) return 'ri-video-line text-secondary';
    else if (file.type.includes('image/')) return 'ri-image-line text-primary';
    else if (file.type.includes('zip')) return 'ri-file-zip-line text-warning';
    else if (file.type.includes('pdf')) return 'ri-file-pdf-line text-info';
    return 'ri-attachment-line text-success';
  }

  get allowedExtensions(): string[] {
    const mapped = this.options.acceptedFileTypes.map(x => x.getExtensions);
    let extensions = mapped.reduce(function (a, b) {
      return a.concat(b);
    }, []);
    return extensions.map(x => `.${x}`);
  }

}
