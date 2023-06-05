import { EventAllowedActions, EventStatusEnum, LocationTypeEnum } from 'app/+events/models';

export class Event {
  id?: string;
  name?: string;
  typeName?: string;
  startDate: string;
  endDate: string;
  reference: string;
  status: EventStatusEnum;
  coverImageUrl?: string;
  days?: number;
  hours?: number;
  hasPermission?: boolean;
  eventLocation?: EventLocation;
  allowedActions?: EventAllowedActions[];
}

class EventLocation {
  locationType?: LocationTypeEnum;
  locationLink?: string;
  locationDescription?: string;
  gPSLocation?: GPSLocation;
}

class GPSLocation {
  latitude?: number;
  longitude?: number;
  url?: string;
  formattedAddress?: string;
}
