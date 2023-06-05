import { Injectable } from '@angular/core';
import { NotificationService } from "@shared/services";
import { FileSizeMeasurementEnum, AcceptedFileType, UploadFilesOptions, FileTypeEnum } from "@libs/upload-files/models";

@Injectable()
export class FilesService {

  file: File;
  options: UploadFilesOptions;

  constructor() {
  }

  public validateFile(file: File, options: UploadFilesOptions): { isValid: boolean, errors: string[] } {

    this.file = file;
    this.options = options;

    if(!this.isValidFileType) {
      const errMsg = `'${file.name}' is not allowed file type.` + this.allowedExtensionsAsString(this.options.acceptedFileTypes);
      return {isValid: false, errors: [errMsg]}
    }

    if(this.options.validateFileSize && !this.isValidFileSize) {
      const measurement = this.acceptedFileType.maxFileSize.measurement;
      const errMsg = `'${file.name}' size should smaller than or equal ${this.acceptedFileType.maxFileSize.size} ${this.convertToShort(measurement)}.`;
      return {isValid: false, errors: [errMsg]}
    }

    return {isValid: true, errors: []};
  }

  allowedExtensionsAsString(types: any[]){
    let message = '';
    types.forEach(type => {
      message += `<br/> Allowed ${FileTypeEnum[type.fileType]} extensions: ${type.getExtensions.join(', ') }.`;
    });
    return message;
  }

  private get isValidFileType(): boolean {
    const mapped = this.options.acceptedFileTypes.map(x => x.getExtensions);
    let extensions = mapped.reduce(function(a, b){ return a.concat(b); }, []);
    return extensions.includes(this.fileExtension);
  }

  private get isValidFileSize(): boolean {
    let fileSize = 0;

    switch (this.acceptedFileType.maxFileSize.measurement){
      case FileSizeMeasurementEnum.Kilobytes:
        fileSize = this.file.size / 1024;
        break;
      case FileSizeMeasurementEnum.Megabytes:
        fileSize = this.file.size / 1024 / 1024;
        break;
      case FileSizeMeasurementEnum.Gigabytes:
        fileSize = this.file.size / 1024 / 1024 /1024;
        break;
    }

    return fileSize <= this.acceptedFileType.maxFileSize.size;
  }

  private get fileExtension(): string {
    return (this.file.name.split(".").pop() || '').trim().toLowerCase();
  }

  private get acceptedFileType(): AcceptedFileType {
    return this.options.acceptedFileTypes.find(x => x.getExtensions.includes(this.fileExtension));
  }

  private convertToShort(size: FileSizeMeasurementEnum){
    if(size == FileSizeMeasurementEnum.Megabytes)
      return 'MB';
    if(size == FileSizeMeasurementEnum.Kilobytes)
      return 'KB';
    else
      return 'GB';
  }

}
