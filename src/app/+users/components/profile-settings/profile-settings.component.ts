import { UsersController } from 'app/+users/controllers/UsersController';
import { Router } from '@angular/router';
import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, OnInit } from '@angular/core';

@Component({
  selector: 'profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})

/**
 * Profile Settings Component
 */
export class ProfileSettingsComponent extends BaseComponent implements OnInit {

  image: File;
  activeId: number;
  completionPercentage: number = 0;
  userProfile: any;
  signature: string = null;

  constructor
  (
      public override injector: Injector,
      private _router: Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.checkActiveTab();
    this.getProfile();
  }

  getProfile() {
    this.httpService.GET(UsersController.MyProfile)
        .subscribe((profile => {
          this.userProfile = profile;
          this.completionPercentage = profile.totalProfile;
          this.signature = profile.signature;
        }))
  }

  checkActiveTab() {
    if (this._router.url == '/users/profile-settings') {
      this.activeId = 1;
      console.log(this.activeId);
    } else if (this._router.url == '/users/profile-settings/change-password') {
      this.activeId = 2;
      console.log(this.activeId);
    } else {
      this.activeId = 3;
      console.log(this.activeId);
    }
  }

  saveImageInComponent(myImage: File) {
    this.image = myImage;
  }

}
