import { GPSLocation } from 'app/+events/models/gps-location.model';
import { LocationTypeEnum } from "app/+events/models/enum";

export class EventLocation {
  locationType: LocationTypeEnum;
  locationDescription: string;
  locationLink?: string;
  gpsLocation?: GPSLocation;
}
