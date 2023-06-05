import { EventLocation } from "app/+events/models/event-location.model";

export class EventOverview {
  description: string;
  eventLocation: EventLocation;
  performances: string[];
  statistics: EventStatistics;
}
export class EventStatistics {
  profits: number;
  orders: number;
  ticketPurchased: number;
  requests: number;
}
