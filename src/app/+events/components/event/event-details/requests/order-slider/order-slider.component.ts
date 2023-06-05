import { BaseComponent } from '@shared/base/base.component';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { EventAllowedActions } from 'app/+events/models';

@Component({
  selector: 'order-slider',
  templateUrl: './order-slider.component.html',
  styleUrls: ['./order-slider.component.scss']
})

export class OrderSliderComponent extends BaseComponent implements OnInit, OnChanges {
  @Input('request') request: any;
  @Output('approve') approve = new EventEmitter<any[]>();
  @Output('reject') reject = new EventEmitter<any[]>();
  eventAllowedActions = EventAllowedActions;

  constructor(
      public override injector: Injector
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }

  eventAllowedAction(action: EventAllowedActions): boolean {
    return true;
  }

}
