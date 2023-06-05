import { UserInfo } from "@shared/models/BaseModels/UserInfo";

export class AuditableEntityDto {
  createdDate: string;
  lastModifiedDate: string;
  createdBy?: UserInfo;
  lastModifiedBy?: UserInfo;
}
