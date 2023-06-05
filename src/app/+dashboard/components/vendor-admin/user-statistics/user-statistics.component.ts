import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';
import { RolesEnum } from 'app/+auth/models';
import { VendorDashboardController } from 'app/+dashboard/controllers/VendorDashboardController';

@Component({
  selector: 'user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.scss']
})
export class UserStatisticsComponent extends BaseComponent implements OnInit {
  roleEnum = RolesEnum;
  data: any;
  filter: any = null;
  constructor(
    public override injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    let body: any = {
      role: this.filter
    }
    this.httpService.GET(VendorDashboardController.GetUserStatistics, body)
      .subscribe((data) => {
        this.data = data;
      });
  }
}
