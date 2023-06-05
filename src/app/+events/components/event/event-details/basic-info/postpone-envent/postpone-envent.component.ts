import {
  Component,
  ElementRef,
  Injector,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
} from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "@shared/base/base.component";
import { Event, LocationTypeEnum } from "app/+events/models";
import { EventValidator } from "app/+events/validators";
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive';
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-postpone-envent",
  templateUrl: "./postpone-envent.component.html",
  styleUrls: ["./postpone-envent.component.scss"],
})
export class PostponeEnventComponent extends BaseComponent implements OnInit {
  @Input("title") title: any;
  @Input("url") url: any;
  @Input("eventBasicInfo") eventBasicInfo: Event;

  eventForm: UntypedFormGroup;
  submitted: boolean = false;
  locationType = LocationTypeEnum;

  /**
   * google maps
   */
  @ViewChild('placesRef', { static: true }) placesRef: GooglePlaceDirective;
  @ViewChild('search', { static: true }) public searchElement: ElementRef;
  lat: number = 14.0077592;
  lng: number = -60.9890346;

  constructor(
    public override injector: Injector,
    private _builder: UntypedFormBuilder,
    public modalService: NgbActiveModal
  ) {
    super(injector);
  }

  ngOnInit(): void {
    console.log(this.eventBasicInfo);
    this.lat = this.eventBasicInfo?.eventLocation?.gPSLocation?.latitude ?? this.lat;
    this.lng = this.eventBasicInfo?.eventLocation?.gPSLocation?.longitude ?? this.lng;
    this.initializeForm();
  }

  initializeForm() {
    this.eventForm = this._builder.group({
      startDateTime: new FormControl(new Date(this.eventBasicInfo.startDate), EventValidator.startDate),
      endDateTime: new FormControl(new Date(this.eventBasicInfo.endDate), EventValidator.endDate),
      eventLocation: this._builder.group({
        locationType: new FormControl(this.eventBasicInfo?.eventLocation?.locationType),
        locationLink: new FormControl(this.eventBasicInfo?.eventLocation?.locationLink, EventValidator.locationLink),
        locationDescription: new FormControl(this.eventBasicInfo?.eventLocation?.locationDescription),
        gPSLocation: this._builder.group({
          latitude: new FormControl(this.lat),
          longitude: new FormControl(this.lng),
          url: new FormControl(this.eventBasicInfo?.eventLocation?.gPSLocation?.url),
          formattedAddress: new FormControl(this.eventBasicInfo?.eventLocation?.gPSLocation?.formattedAddress),
        }),
      }),
    });
  }

  get isOnline() {
    return (
      this.eventForm?.get("eventLocation.locationType").value ==
      LocationTypeEnum.online
    );
  }

  get isOnsite() {
    return (
      this.eventForm?.get("eventLocation.locationType").value ==
      LocationTypeEnum.onsite
    );
  }

  clearOnline() {
    this.eventForm.get("eventLocation.locationDescription").patchValue(null);
    this.eventForm.get("eventLocation.locationLink").patchValue(null);
  }

  clearOnsite() {
    this.eventForm.get("eventLocation.locationDescription").patchValue(null);
    this.lat = 14.0077592;
    this.lng = -60.9890346;
    this.eventForm
      .get("eventLocation.gPSLocation.latitude")
      .patchValue(this.lat);
    this.eventForm
      .get("eventLocation.gPSLocation.longitude")
      .patchValue(this.lng);
  }

  addNullAccordingToLocationType(body: any) {
    if (body.eventLocation.locationType == LocationTypeEnum.online) {
      body.eventLocation.gPSLocation = null;
    } else {
      body.eventLocation.locationLink = null;
    }
    return body;
  }

  public handleAddressChange(address: Address) {
    console.log(address);
    this.lng = address.geometry.location.lng();
    this.lat = address.geometry.location.lat();
    this.patchValue("eventLocation.gPSLocation.latitude", this.lat);
    this.patchValue("eventLocation.gPSLocation.longitude", this.lng);
    this.patchValue("eventLocation.gPSLocation.url", address.url);
    this.patchValue(
      "eventLocation.gPSLocation.formattedAddress",
      address.formatted_address
    );
  }

  patchValue(controller: string, value: any) {
    this.eventForm?.get(controller)?.patchValue(value);
  }

  postpone() {
    let body = this.eventForm.getRawValue();
    console.log("this is my first body", body);
    this.httpService
      .PUT(this.url, body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.modalService.close(true);
        this.notificationService.success(
          "Postponed",
          ` ${this.title} Postponed successfully! 🎉`
        );
      });
  }

  startDateLessOrEqual() {
    return this.eventForm.get('startDateTime').value <= new Date(this.eventBasicInfo.startDate) || 
            this.eventForm.get('startDateTime').value >= this.eventForm.get('endDateTime').value;
  }
}
