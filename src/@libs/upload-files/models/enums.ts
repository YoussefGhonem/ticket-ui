export enum FileSizeMeasurementEnum {
  Kilobytes = 1,
  Megabytes = 2,
  Gigabytes = 3,
}

export enum FileTypeEnum {
  Image = 1,
  Video = 2,
  Audio = 3,
  Pdf = 4,
  Excel = 5,
  ExactExtension = 6
}

export enum OnUploadFailedEnum {
  UploadOnlyValidFilesAndSkipInvalidFiles = 1,
  DoNotUploadAnyFiles = 2,
}

export enum AfterUploadSuccessEnum {
  AppendNewFilesToExistingFiles= 1,
  ResetTheFiles = 2,
}
