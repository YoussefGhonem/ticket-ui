export enum EventStatusEnum {
  All = null,
  Draft = 1,
  Published = 2,
  Ended = 3,
  Canceled = 4,
}
export enum EventSortEnum {
  Name = 1,
  Status = 2,
  StartDate = 3,
  EndDate = 4,
  CreatedDate = 5,
}

export enum TicketTypeSortEnum {
  Title = 1,
  Price = 2,
  Quantity = 3,
  CreatedDate = 4,
}

export enum LocationTypeEnum {
  onsite = 1,
  online = 2,
}
export enum EventAllowedActions {
  Published = 1,
  Canceled = 2,
  Delete = 3,
  Edit = 4,
  EditWhenDraftOrPublished = 5,
  EditWhenPublished = 6,
  AddComplimentary = 7,
  Postpone = 8,
}
export enum FileTypeEnum {
  Image = 1,
  Video = 2,
  Audio = 3,
}
export enum EventAttahcmentAllowedActions {
  Delete = 1,
  Download = 2,
}
export enum TicketTypeAllowedActions {
  Edit = 1,
  IncreaseQuantity = 2,
  Delete = 3,
  AddNewInvitedClients = 4,
}

export enum EventAuditEnum {
  Created = 1,
  Updated = 2,
  Deleted = 3
}

export enum RequestStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Expired = 4,
  Withdrawn = 5
}

export enum RequestAllowedActions {
Preview = 1,
Approve = 2,
Reject = 3
}

