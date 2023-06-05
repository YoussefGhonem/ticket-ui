import { AfterUploadSuccessEnum, FileSizeMeasurementEnum, FileTypeEnum, OnUploadFailedEnum } from "./enums";

export class UploadFilesOptions {
  validateFileSize: boolean = true;
  afterUploadSuccess: AfterUploadSuccessEnum = AfterUploadSuccessEnum.AppendNewFilesToExistingFiles;
  onUploadFailed: OnUploadFailedEnum = OnUploadFailedEnum.UploadOnlyValidFilesAndSkipInvalidFiles;
  acceptedFileTypes: AcceptedFileType[] = [
    new AcceptedFileType(FileTypeEnum.Image, {size: 1, measurement: FileSizeMeasurementEnum.Megabytes}),
    new AcceptedFileType(FileTypeEnum.Video, {size: 5, measurement: FileSizeMeasurementEnum.Megabytes}),
    new AcceptedFileType(FileTypeEnum.Audio, {size: 5, measurement: FileSizeMeasurementEnum.Megabytes}),
  ];
}

export class AcceptedFileType {
  fileType: FileTypeEnum;
  extension?: string | string[] | null; // in case fileType is ExactExtension
  maxFileSize: FileSize = new FileSize();

  get getExtensions(): string[] {
    switch (this.fileType) {
      case FileTypeEnum.Image:
        return ['png', 'jpg', 'jpeg', 'gif', 'tiff', 'bpg', 'jfif'];
      case FileTypeEnum.Video:
        return ['mp4', 'mov', 'wmv',
                'flv', 'webm', 'mkv',
                'avchd', 'mbg', 'mb2',
                'mbeg', 'mbe', 'mbv',
                'ogg', 'm4p', 'm4v',
                'avi'];
      case FileTypeEnum.Audio:
        return ['wav', 'aif', 'mp3', 'mid'];
      case FileTypeEnum.Pdf:
        return ['pdf'];
      case FileTypeEnum.Excel:
        return ['xlsx', 'csv'];
      case FileTypeEnum.ExactExtension:
        if (typeof this.extension == 'string') return [this.extension];
        if (typeof this.extension == 'object') return this.extension;
        break;
      default:
        return [];
    }
    return [];
  }

  constructor(fileType: FileTypeEnum, maxFileSize: FileSize, extension: string = null) {
    this.fileType = fileType;
    this.maxFileSize = maxFileSize;
    this.extension = extension;
  }
}

export class FileSize {
  size: number = 1;
  measurement: FileSizeMeasurementEnum = FileSizeMeasurementEnum.Megabytes;
}

