import { EventOverview } from 'app/+events/models/event-overview.model';
import { ActivatedRoute } from '@angular/router';
import { EventStatusEnum } from 'app/+events/models/enum';
import { Event } from 'app/+events/models/event.model';
import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';
import { EventsController } from 'app/+events/controllers';

@Component({
  selector: 'app-event-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class EventOverviewComponent extends BaseComponent implements OnInit {

  @Input() eventBasicInfo: Event;
  @Output('loadActivities') loadActivities = new EventEmitter();

  eventStatus = EventStatusEnum;
  eventId: string;
  overview: EventOverview;

  constructor(
    public override injector: Injector,
    private router: ActivatedRoute
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getEventIdFromQuery();
    this.loadEventOverview();
  }


  getEventIdFromQuery() {
    this.router.paramMap
      .subscribe(params => {
        console.log(params);
        this.eventId = params.get('id');
      });
  }

  loadActivitiesEvent() {
    this.loadActivities.emit();
  }

  loadEventOverview() {
    this.httpService.GET(EventsController.GetOverview(this.eventId))
      .subscribe(overview => {
        console.log("overview=>>>>>>>>>",overview);
        this.overview = overview;
      });
  }
}
