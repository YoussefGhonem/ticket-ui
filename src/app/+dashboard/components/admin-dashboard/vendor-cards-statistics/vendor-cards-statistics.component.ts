import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';
import { AdminDashboardController } from 'app/+dashboard/controllers/AdminDashboardController';
import { VendorDashboardController } from 'app/+dashboard/controllers/VendorDashboardController';

@Component({
  selector: 'vendor-cards-statistics',
  templateUrl: './vendor-cards-statistics.component.html',
  styleUrls: ['./vendor-cards-statistics.component.scss']
})
export class VendorCardsStatisticsComponent extends BaseComponent implements OnInit {
  data: any;

  constructor(
    public override injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {

    this.httpService.GET(AdminDashboardController.GetVendorStatistics, {})
      .subscribe((data) => {
        this.data = data;
      });
  }
}
