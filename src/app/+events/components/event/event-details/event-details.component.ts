import { Event, EventStatusEnum } from 'app/+events/models';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsController } from 'app/+events/controllers';
import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent extends BaseComponent implements OnInit {

  eventId: string;
  eventBasicInfo: Event;
  eventStatus: EventStatusEnum;
  activeId: number = 1;
  filters: object = null;
  currentPage: number = 1;
  hasPermission: boolean = true;

  // activities
  eventActivities: any[] = [];

  constructor(
    public override injector: Injector,
    private router: ActivatedRoute,
    private newRouter: Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getEventIdFromQuery();
    this.getActiveIdFromQuery();
  }

  getEventIdFromQuery() {
    this.router.paramMap
      .subscribe(params => {
        console.log(params);
        this.eventId = params.get('id');
        this.loadEventBasicInfo();
      });
  }

  getActiveIdFromQuery() {
    this.router.queryParams
    .subscribe(params => {
      this.activeId = Number.parseInt(params['activeId']);
      console.log(params);
    })
  }

  loadActivities(filters: object = null) {
    this.filters = filters ?? this.filters; 
    this.httpService.GET(EventsController.GetEventActivities(this.eventId), this.filters)
      .subscribe(res => {
      console.log(res);
       this.eventActivities = res?.data.length == 0 ? this.eventActivities : this.eventActivities.concat(res?.data) ;
      })
  }

  loadActivitiesFirstTime(filters: object = null) {
    this.filters = filters ?? this.filters; 
    this.httpService.GET(EventsController.GetEventActivities(this.eventId), this.filters)
      .subscribe(res => {
      console.log(res);
       this.eventActivities = res?.data.length == 0 ? [] : res?.data ;
      })
  }

  loadEventBasicInfo() {
    this.httpService.GET(EventsController.GetBasicInfo(this.eventId))
      .subscribe(basicInfo => {
        console.log("afdasf", basicInfo);
        this.eventBasicInfo = basicInfo;
        this.hasPermission = this.eventBasicInfo?.hasPermission;
      });
  }


  getBackGroundColor(data) {
    let eventStatusAsString = EventStatusEnum[data];
    switch (eventStatusAsString) {
      case EventStatusEnum[EventStatusEnum.Draft]:
        return 'dark';
      case EventStatusEnum[EventStatusEnum.Published]:
        return 'success';
      case EventStatusEnum[EventStatusEnum.Ended]:
        return 'info';
      default:
        return 'danger';
    }
  }

  get isDraft(): boolean {
    return this.eventBasicInfo?.status == EventStatusEnum.Draft;
  }

  getDetails(activeId: number){
    this.newRouter.navigate([`/events/${this.eventId}`], {
      queryParams: {
        activeId: activeId
      }
    })
  }

}
