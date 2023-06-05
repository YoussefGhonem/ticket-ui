import { EventValidator } from 'app/+events/validators';
import { EventsController } from 'app/+events/controllers';
import { ActivatedRoute } from '@angular/router';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { EventLocation } from 'app/+events/models/event-location.model';
import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { EventAllowedActions, LocationTypeEnum } from "app/+events/models";
import { MapsAPILoader } from '@agm/core';
export declare var google: any;

@Component({
  selector: 'app-event-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class EventLocationComponent extends BaseComponent implements OnInit, OnChanges {
  updateLocationForm!: UntypedFormGroup;
  mapForm!: UntypedFormGroup;
  address: string;
  eventId: string;

  @ViewChild('placesRef', { static: true }) placesRef: GooglePlaceDirective;
  lat?: number = 14.0077592;
  lng?: number = -60.9890346;
  @Input() eventAllowedAction: EventAllowedActions[];
  allowedActions = EventAllowedActions;
  @Input() eventLocation: EventLocation;
  @Output() getNewLocation = new EventEmitter();

  editMode: boolean = false;
  locationType = LocationTypeEnum;
  selectedLocationType: LocationTypeEnum = LocationTypeEnum.onsite;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    public override injector: Injector,
    private _router: ActivatedRoute,
    private _builder: UntypedFormBuilder
  ) {
    super(injector);
  }

  hasAllowedAction(action: EventAllowedActions): boolean {
    let allowedActions = this.eventAllowedAction as Array<EventAllowedActions>
    return allowedActions?.includes(action);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.eventLocation);
    this.initializeForm();
    this.patchForm();
    this.initMapForm();
    this.patchMapForm();
    this.lat = this.eventLocation?.gpsLocation?.latitude ?? this.lat;
    this.lng = this.eventLocation?.gpsLocation?.longitude ?? this.lng;
    this.selectedLocationType = this.eventLocation?.locationType;
    this.getAddress(this.lat, this.lng);

  }

  ngOnInit(): void {
    this.getEventIdFromQuery();
  }

  getEventIdFromQuery() {
    this._router.paramMap
      .subscribe(params => {
        console.log(params);
        this.eventId = params.get('id');
      });
  }

  clearOnline() {
    this.updateLocationForm.get('eventLocation.locationDescription').patchValue(null);
    this.updateLocationForm.get('eventLocation.locationLink').patchValue(null);
  }

  clearOnsite() {
    this.updateLocationForm.get('eventLocation.locationDescription').patchValue(null);
    this.lat = 14.0077592;
    this.lng = -60.9890346;
    this.updateLocationForm?.get('eventLocation.gPSLocation.latitude')?.patchValue(this.lat);
    this.updateLocationForm?.get('eventLocation.gPSLocation.longitude')?.patchValue(this.lng);
    this.mapForm.get('input').patchValue('');
  }


  initializeForm() {
    this.updateLocationForm = this._builder.group({
      eventLocation: this._builder.group({
        locationType: new FormControl(null),
        locationLink: new FormControl(null, EventValidator.locationLink),
        locationDescription: new FormControl(null),
        gpsLocation: this._builder.group({
          latitude: new FormControl(null),
          longitude: new FormControl(null),
          url: new FormControl(null),
          formattedAddress: new FormControl(null)
        })
      })
    })
  }

  initMapForm() {
    this.mapForm = this._builder.group({
      input: new FormControl(null)
    })
  }

  patchMapForm() {
    this.mapForm.get('input').patchValue(this.eventLocation?.gpsLocation?.formattedAddress);
  }

  patchForm() {
    this.updateLocationForm.get('eventLocation.locationType').patchValue(this.eventLocation?.locationType);
    this.updateLocationForm.get('eventLocation.locationLink').patchValue(this.eventLocation?.locationLink);
    this.updateLocationForm.get('eventLocation.locationDescription').patchValue(this.eventLocation?.locationDescription);
    this.updateLocationForm.get('eventLocation.gpsLocation.latitude').patchValue(this.eventLocation?.gpsLocation?.latitude);
    this.updateLocationForm.get('eventLocation.gpsLocation.longitude').patchValue(this.eventLocation?.gpsLocation?.longitude);
    this.updateLocationForm.get('eventLocation.gpsLocation.url').patchValue(this.eventLocation?.gpsLocation?.url);
    this.updateLocationForm.get('eventLocation.gpsLocation.formattedAddress').patchValue(this.eventLocation?.gpsLocation?.formattedAddress);
  }

  get isOnline() {
    return this.updateLocationForm.get('eventLocation.locationType').value == LocationTypeEnum.online;
  }

  get isOnsite() {
    return this.updateLocationForm.get('eventLocation.locationType').value == LocationTypeEnum.onsite;
  }

  onEditClick() {
    this.updateLocationForm?.get('eventLocation.locationType').patchValue(this.eventLocation?.locationType);
    this.updateLocationForm?.get('eventLocation.locationLink').patchValue(this.eventLocation?.locationLink);
    this.lat = this.eventLocation?.gpsLocation?.latitude ?? this.lat;
    this.lng = this.eventLocation?.gpsLocation?.longitude ?? this.lng;
    this.editMode = true;
  }

  onCancelClick() {
    this.patchForm();
    this.patchMapForm();
    this.editMode = false;
    this.updateLocationForm.markAsPristine();
  }
  ValidateLocationForm(): boolean {
    if (this.updateLocationForm.invalid || (this.updateLocationForm.pristine)) return true;
    else if (this.isOnline) {
      if (this.updateLocationForm.get('eventLocation.locationLink')?.value?.length == 0) return true;
    }
    else if (this.isOnsite) {
      if (this.updateLocationForm.get('gPSLocation.latitude')?.value?.length == 0) return true;
    }
    return false;
  }

  onSaveClick() {
    if (this.updateLocationForm.invalid) {
      return;
    }
    let body = this.updateLocationForm.getRawValue();
    body = this.addNullAccordingToLocationType(body);

    this.httpService.PATCH(EventsController.UpdateLocation(this.eventId), body)
      .subscribe(res => {
        this.notificationService.success("Changes are saved", "Location Updated successfully");
        this.editMode = false;
        this.getNewLocation.emit();
      })
  }

  toOnsite() {
    this.selectedLocationType = LocationTypeEnum.onsite;
  }

  toOnline() {
    this.selectedLocationType = LocationTypeEnum.online;
  }

  addNullAccordingToLocationType(body: any) {
    console.log(body);
    if (body.eventLocation.locationType == LocationTypeEnum.online) {
      body.eventLocation.gpsLocation = null;
    } else {
      body.eventLocation.locationLink = null;
    }
    return body;
  }

  getAddress(latitude, longitude) {
    //load Places Autocomplete
    let geoCoder;
    this.mapsAPILoader.load().then(() => {
      geoCoder = new google.maps.Geocoder;
      geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
        console.log(results);
        console.log(status);
        if (status === 'OK') {
          if (results[0]) {
            this.address = results[0].formatted_address;
            console.log("formatted_address", results[0]);

          }
        } else {
        }
      });
    });

  }

  public handleAddressChange(address: Address) {
    console.log(address);
    this.lng = address.geometry.location.lng();
    this.lat = address.geometry.location.lat();
    this.updateLocationForm.get('eventLocation.gpsLocation.latitude').patchValue(this.lat);
    this.updateLocationForm.get('eventLocation.gpsLocation.longitude').patchValue(this.lng);
    this.updateLocationForm.get('eventLocation.gpsLocation.url').patchValue(address.url);
    this.updateLocationForm.get('eventLocation.gpsLocation.formattedAddress').patchValue(address.formatted_address);
    this.updateLocationForm.markAsDirty();
  }

}
