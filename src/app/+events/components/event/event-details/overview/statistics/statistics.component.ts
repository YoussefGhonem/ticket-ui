import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@shared/base/base.component';
import { EventsController } from 'app/+events/controllers';

@Component({
  selector: 'statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent extends BaseComponent implements OnInit {
  statistics: any
  eventId: any

  constructor(
    public override injector: Injector,
    private router: ActivatedRoute
  ) {
    super(injector);
    this.getEventIdFromQuery()
  }
  ngOnInit(): void {
    console.log("statistics", this.statistics);
    this.loadData()
  }
  getEventIdFromQuery() {
    this.router.paramMap
      .subscribe(params => {
        console.log(params);
        this.eventId = params.get('id');
      });
  }

  loadData() {
    this.httpService.GET(EventsController.GetEventStatistics(this.eventId))
      .subscribe(overview => {
        console.log("statistics=>>>>>>>>>", overview);
        this.statistics = overview;
      });
  }
}
