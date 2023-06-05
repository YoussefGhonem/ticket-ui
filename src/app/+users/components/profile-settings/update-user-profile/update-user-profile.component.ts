import { UserModel } from 'app/+auth/models';
import { AuthService } from 'app/+auth/service';
import { UsersValidator } from 'app/+users/validators/user.validator';
import { Router } from '@angular/router';
import { UsersController } from 'app/+users/controllers/UsersController';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AfterViewInit, Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';
import { CountryDropdownModel } from 'app/+users/models/country-dropdown.model';
import { SettingsController } from "app/+settings/controllers";
import { MapsAPILoader } from '@agm/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
export declare var google: any;

@Component({
  selector: 'update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.scss']
})

/**
 * Profile Settings Component
 */
export class UpdateUserProfileComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit {

  updateUserInfoSubmit: boolean = false;
  formChanged: boolean = false;
  updateUserInfoForm!: UntypedFormGroup;
  currentUserEmail!: string;
  countries: CountryDropdownModel[];
  currentCountryCode: string = '';
  @Input() image: File;
  @Input() userProfile: any;

  mapForm: UntypedFormGroup;

  lat: number = 14.0077592;
  lng: number = -60.9890346;
  address: string;

  constructor
    (
      private mapsAPILoader: MapsAPILoader,
      public override injector: Injector,
      private _formBuilder: UntypedFormBuilder,
      private _router: Router,
      private _authService: AuthService
    ) {
    super(injector);
  }
  ngAfterViewInit(): void {
  }
  clearCountryField() {
    this.updateUserInfoForm.get('address').get('countryId').reset();
    this.updateUserInfoForm.markAsDirty();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['userProfile']){
      this.patchForm();
      this.getAddress(this.lat, this.lng);
    }
    if (changes['image'])
      this.markDirty(changes['image']?.currentValue)
  }

  markDirty(image: File) {
    this.updateUserInfoForm?.markAsDirty();
  }

  ngOnInit(): void {
    this.getCountries();
    this.currentUserEmail = this.currentUser?.email;
    this.initializeForm();
    this.initMapForm();
    this.patchForm();
    this.getAddress(this.lat, this.lng);
  }

  getCountries() {
    if(this.countries?.length > 0) return;
    this.httpService.GET(SettingsController.CountriesDropdown)
      .subscribe((countries) => {
        this.countries = countries;
      });
  }

  initializeForm() {
    this.updateUserInfoForm = this._formBuilder.group({
      firstName: new FormControl(null, UsersValidator.firstName),
      lastName: new FormControl(null, UsersValidator.lastName),
      callingCode: new FormControl(null, UsersValidator.callingCode),
      phoneNumber: new FormControl(null, UsersValidator.phoneNumber),
      address: this._formBuilder.group({
        locationDescription: new FormControl(null),
        gPSLocation: this._formBuilder.group({
          latitude: new FormControl(null),
          longitude: new FormControl(null),
          url: new FormControl(null),
          formattedAddress: new FormControl(null),
        })
      }),
      image: [this.image]
    });

  }

  initMapForm() {
    this.mapForm = this._formBuilder.group({
      input: new FormControl(this.userProfile?.address?.gpsLocation?.formattedAddress ?? null)
    })
  }

  patchForm() {
    this.updateUserInfoForm?.controls['firstName']?.patchValue(this.userProfile?.firstName);
    this.updateUserInfoForm?.controls['lastName']?.patchValue(this.userProfile?.lastName);
    this.updateUserInfoForm?.controls['callingCode']?.patchValue(this.userProfile?.phoneNumber?.split('-')[0])
    this.updateUserInfoForm?.controls['phoneNumber']?.patchValue(this.userProfile?.phoneNumber?.split('-')[1]);
    this.updateUserInfoForm
      ?.get("address.locationDescription")
      ?.patchValue(this.userProfile?.address?.locationDescription);
    this.updateUserInfoForm
      ?.get("address.gPSLocation.latitude")
      ?.patchValue(this.userProfile?.address?.gpsLocation?.latitude);
    this.updateUserInfoForm
      ?.get("address.gPSLocation.longitude")
      ?.patchValue(this.userProfile?.address?.gpsLocation?.longitude);
    this.updateUserInfoForm
      ?.get("address.gPSLocation.url")
      ?.patchValue(this.userProfile?.address?.gpsLocation?.url);
    this.updateUserInfoForm
    ?.get("address.gPSLocation.formattedAddress")
    ?.patchValue(this.userProfile?.address?.gpsLocation?.formattedAddress);

    this.lat = this.userProfile?.address?.gpsLocation?.latitude ?? this.lat;
    this.lng = this.userProfile?.address?.gpsLocation?.longitude ?? this.lng;
    this.mapForm?.get('input')?.patchValue(this.userProfile?.address?.gpsLocation?.formattedAddress ?? null);
  }

  onSelectChange(country: any) {
    this.currentCountryCode = country === null ? '' : country?.callingCode;
  }


  onUserInfoSubmit() {
    this.updateUserInfoSubmit = true;
    if (this.updateUserInfoForm.invalid) {
      return;
    }

    let body = this.updateUserInfoForm.getRawValue();
    body.image = this.image;
    body.phoneNumber = body.callingCode + '-' + body.phoneNumber;

    this.httpService.PUT(UsersController.UpdateUser, this.httpService.objectToFormData(body), undefined)
      .subscribe(() => {
        this.notificationService.success('Changes are saved', 'Profile updated successfully! 🎉');
        this.updateCurrentUserProfile();
        this._router.navigate(['/users/profile']);
      })
  }

  private updateCurrentUserProfile() {
    this.httpService.GET(UsersController.MyProfile)
      .subscribe((profile => {
        this._authService.UpdateUserInfo(profile.firstName, profile.lastName, profile.phoneNumber, profile.image);
      }))
  }

  public handleAddressChange(address: Address) {
    console.log(address);
    this.lng = address.geometry.location.lng();
    this.lat = address.geometry.location.lat();
    this.patchValue('address.gPSLocation.latitude', this.lat);
    this.patchValue('address.gPSLocation.longitude', this.lng);
    this.patchValue('address.gPSLocation.url', address.url);
    this.patchValue('address.gPSLocation.formattedAddress', address.formatted_address);
    this.updateUserInfoForm.markAsDirty();
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

  patchValue(controller: string, value: any) {
    this.updateUserInfoForm?.get(controller)?.patchValue(value);
  }
}
