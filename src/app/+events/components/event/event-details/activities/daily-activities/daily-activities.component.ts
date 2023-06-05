import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { EventsController } from 'app/+events/controllers';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'daily-activities',
  templateUrl: './daily-activities.component.html',
  styleUrls: ['./daily-activities.component.scss']
})

export class DailyActivitiesComponent extends BaseComponent implements OnInit, OnChanges {

  @Input('eventActivities') eventActivities: any[] = [];

  constructor(
      public override injector: Injector,
      private _router: ActivatedRoute
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }

  isExpandable(item: any) {
    return item?.extraInfo?.hasDescription;
  }

}
