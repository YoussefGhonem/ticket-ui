import { LocationTypeEnum } from 'app/+events/models';
import { MembersController } from 'app/+vendors/controllers';
import { EventTypesController } from 'app/+settings/controllers/EventTypesController';
import { EventsController } from 'app/+events/controllers';
import { EventValidator } from 'app/+events/validators';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BaseComponent } from '@shared/base/base.component';
import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// Google Maps
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive';
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { Router } from '@angular/router';
import { filesService } from '@shared/services';
import { UploadFilesComponent } from "@libs/upload-files/upload-files.component";

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent extends BaseComponent implements OnInit {

  @ViewChild(UploadFilesComponent, { static: true }) public uploadFilesComponent: UploadFilesComponent;

  eventForm: UntypedFormGroup;
  mapForm: UntypedFormGroup;
  submitted: boolean = false;
  eventTypes: any[];
  members: any[];
  days: number[] = [];
  hours: number[] = [];
  selectedMembers: any[];
  locationType = LocationTypeEnum;

  editorConfig = {
    removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload'],
    removeButtons: ['Image']
  };

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  public Editor = ClassicEditor;

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
    private _router: Router,
    public _imagesService: filesService
  ) {
    super(injector);
    for(let i = 0; i < 25; i++)
      this.hours.push(i);

    for(let i = 0; i < 32; i++)
      this.days.push(i);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Events' },
      { label: 'Create Event', active: true }
    ];

    this.loadEventTypes();
    this.loadVendorMembers();
    this.initializeForm();
    this.initMapForm();
  }

  ValidateLocationForm(): boolean {
    if((this.eventForm.get('days').value == null || this.eventForm.get('days').value == 0) && (this.eventForm.get('hours').value == null || this.eventForm.get('hours').value == 0)) return true;
    if (this.eventForm.valid) return false;

    else if (this.eventForm.invalid) return true;
    else if (this.isOnline) {
      if (this.eventForm.get('eventLocation.locationLink').value?.length == 0) return true;
    }
    else if (this.isOnsite) {
      if (this.eventForm.get('gPSLocation.latitude').value?.length == 0) return true;
    }
    return false;
  }

  initializeForm() {
    this.eventForm = this._builder.group({
      name: new FormControl(null, EventValidator.name),
      eventTypeId: new FormControl(null, EventValidator.eventType),
      startDateTime: new FormControl(null, EventValidator.startDate),
      endDateTime: new FormControl(null, EventValidator.endDate),
      description: new FormControl(null, EventValidator.description),
      eventLocation: this._builder.group({
        locationType: new FormControl(LocationTypeEnum.onsite),
        locationLink: new FormControl(null, EventValidator.locationLink),
        locationDescription: new FormControl(null),
        gPSLocation: this._builder.group({
          latitude: new FormControl(null),
          longitude: new FormControl(null),
          url: new FormControl(null),
          formattedAddress: new FormControl(null),
        })
      }),
      attachments: [],
      eventMemberIds: [],
      termsAndConditions: new FormControl(null),
      coverImage: new FormControl(null, EventValidator.coverImage),
      days: new FormControl(0),
      hours: new FormControl(0)
    });

  }

  initMapForm() {
    this.mapForm = this._builder.group({
      input: new FormControl(null)
    })
  }

  get isOnline() {
    return this.eventForm.get('eventLocation.locationType').value == LocationTypeEnum.online;
  }

  get isOnsite() {
    return this.eventForm.get('eventLocation.locationType').value == LocationTypeEnum.onsite;
  }

  getEventMembers() {
    let selectedMembersIds = this.eventForm.getRawValue().eventMemberIds;
    return this.members.filter(m => selectedMembersIds.includes(m.id));
  }

  getAttachments(): File[] {
    return this.uploadFilesComponent?.allFiles;
  }

  loadVendorMembers() {
    let queryParams = {
      isActive: true
    };
    this.httpService.GET(MembersController.MembersDrp, queryParams)
      .subscribe((members) => {
        console.log(members);
        this.members = members;
      });
  }

  loadEventTypes() {
    this.httpService.GET(EventTypesController.DropDownForActiveEventTypes)
      .subscribe((eventTypes) => {
        console.log(eventTypes);
        this.eventTypes = eventTypes;
      });
  }

  clearOnline() {
    this.eventForm.get('eventLocation.locationDescription').patchValue(null);
    this.eventForm.get('eventLocation.locationLink').patchValue(null);
  }

  clearOnsite() {
    this.eventForm.get('eventLocation.locationDescription').patchValue(null);
    this.lat = 14.0077592;
    this.lng = -60.9890346;
    this.eventForm.get('eventLocation.gPSLocation.latitude').patchValue(this.lat);
    this.eventForm.get('eventLocation.gPSLocation.longitude').patchValue(this.lng);
    this.mapForm.get('input').patchValue('');

  }


  onFileChange(event, imageTag) {
    const file = event.target.files[0] as File;
    console.log(file);

    if (!file || !this._imagesService.isValidImageExtension(file) || !this._imagesService.isValidFileSize(file, 1024)) {
      imageTag.value = '';
      return;
    };

    let reader = new FileReader();
    reader.onloadend = () => {
      imageTag.src = reader.result;
    };

    this.eventForm.get('coverImage').setValue(file);
  }

  onSubmit() {
    this.submitted = true;

    if (this.eventForm.invalid) {
      return;
    }
    let body = this.eventForm.getRawValue();
    body.startDateTime = body.startDateTime.toUTCString();
    body.endDateTime = body.endDateTime.toUTCString();
    body.attachments = this.getAttachments();
    body = this.addNullAccordingToLocationType(body);
    body.days = body.days ?? 0;
    body.hours = body.hours ?? 0;

    console.log(body);
    let bodyToForm = this.httpService.objectToFormData(body);

    this.httpService.POST(EventsController.Create, bodyToForm)
      .subscribe((res) => {
        this.notificationService.success('Event Created successfully 🎉', 'Please note that you\'ve only created a draft event and will need to complete event details before publishing');
        this._router.navigate(['/events']);
      })
  }

  addNullAccordingToLocationType(body: any) {
    if (body.eventLocation.locationType == LocationTypeEnum.online) {
      body.eventLocation.gPSLocation = null;
    } else {
      body.eventLocation.locationLink = null;
    }
    return body;
  }

  onSelectChange($event: any) {
    this.selectedMembers = this.getEventMembers();
  }


  public handleAddressChange(address: Address) {
    console.log(address);
    this.lng = address.geometry.location.lng();
    this.lat = address.geometry.location.lat();
    this.patchValue('eventLocation.gPSLocation.latitude', this.lat);
    this.patchValue('eventLocation.gPSLocation.longitude', this.lng);
    this.patchValue('eventLocation.gPSLocation.url', address.url);
    this.patchValue('eventLocation.gPSLocation.formattedAddress', address.formatted_address);
  }

  patchValue(controller: string, value: any) {
    this.eventForm?.get(controller)?.patchValue(value);
  }

}
