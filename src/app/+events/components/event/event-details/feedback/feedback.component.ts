import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-event-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})

export class EventFeedBackComponent extends BaseComponent implements OnInit, OnChanges {

  constructor(
      public override injector: Injector
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

}
