import { UserInfo } from '@shared/models/BaseModels/UserInfo';
import { TicketTypeAllowedActions } from "./index";

export class TicketTypeModel {
  id!: string;
  title!: string;
  description!: string;
  ticketPrice: number;
  ticketFeesPercentage: number;
  totalPrice: number;
  totalTickets: number;
  availableTickets: number;
  maxTicketsPerPurchase: number;
  onHoldTickets: number;
  purchasedTickets: number;
  clientsEmails: string[];
  approvalEnabled: boolean;
  allowedActions: TicketTypeAllowedActions[];
  createdDate?: string;
  createdBy: UserInfo;
  lastModifiedDate?: string;
  lastModifiedBy?: UserInfo;
}
export class TicketTypeDropdown {
  id!: string;
  title!: string;
}
