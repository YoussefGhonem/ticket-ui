import { UsersController } from 'app/+users/controllers/UsersController';
import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, OnInit } from '@angular/core';

// Swiper Slider
// import { SwiperComponent, SwiperDirective } from 'ngx-swiper-wrapper';

// import { TokenStorageService } from 'app/core/services/token-storage.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

/**
 * Profile Component
 */
export class ProfileComponent extends BaseComponent implements OnInit {

  src: string = null;
  userInfo: any;
  completionPercentage: number = 0;

  constructor(
      public override injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile() {
    this.httpService.GET(UsersController.MyProfile)
        .subscribe((userProfile) => {
          console.log(userProfile);
          this.userInfo = userProfile;
          this.completionPercentage = userProfile.totalProfile;
          this.src = userProfile.image;
        });
  }

  DoesAddressExist() {
    let address = this?.userInfo?.address;
    if (address?.locationDescription || address?.gpsLocation?.formattedAddress) {
      return true;
    }
    return false;
  }

  getAddress() {
    let address: string = '';
    let street = this.userInfo?.address?.street;
    let city = this.userInfo?.address?.city;
    let country = this.userInfo?.address?.country?.name;
    if (street) {
      address += street;
    }
    if (city) {
      address = street ? address + ', ' + city : address + city;
    }
    if (country) {
      address = street || city ? address + ', ' + country : address + country;
    }
    return address;
  }

  previousSlideComp() {

  }

  nextSlideComp() {

  }


}
