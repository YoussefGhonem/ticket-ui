import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { UserInfo } from "@shared/models/BaseModels/UserInfo";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit, OnChanges {

  @Input('userInfo') userInfo: UserInfo;
  @Input('userData') userData: any;
  @Input('displayImage') displayImage: boolean = true;

  constructor() {
  }

  setUserInfo() {
    if (this.userData == null) return

    var user = new UserInfo();
    user.email = this.userData.email;
    user.imageUrl = this.userData?.image;
    user.name = this.userData?.name;
    this.userInfo = user;
  }

  ngOnChanges(): void {
    this.setUserInfo()
  }

  ngOnInit(): void {
  }

}
