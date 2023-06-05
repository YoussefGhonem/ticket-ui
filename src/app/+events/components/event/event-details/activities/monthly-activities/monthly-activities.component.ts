import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { EventsController } from 'app/+events/controllers';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'monthly-activities',
  templateUrl: './monthly-activities.component.html',
  styleUrls: ['./monthly-activities.component.scss']
})

export class MonthlyActivitiesComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() eventId: string;
  eventActivities: any[];

  constructor(
      public override injector: Injector,
      private _router: ActivatedRoute
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.loadActivites();
  }


  loadActivites() {
    this.httpService.GET(EventsController.GetEventActivities(this.eventId))
      .subscribe(res => {
        console.log(res);
       this.eventActivities = res?.data;
      })
  }

}
