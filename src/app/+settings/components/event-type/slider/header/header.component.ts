import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from "@angular/core";

@Component({
  selector: 'slider-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class SliderHeaderComponent extends BaseComponent implements OnInit, OnChanges {

  @Input('eventType') eventType: any = null;
  constructor(
      public override injector: Injector,
  ) {
    super(injector);


  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
  }

  presentDate(date: string) {
    let newDate = new Date(date);
    let time = newDate.toLocaleTimeString('en-Us', {
      hour: '2-digit',
      minute:'2-digit'
    });
    return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()} - ${time}`;
  }

}
