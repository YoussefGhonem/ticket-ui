import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from "@angular/core";

@Component({
  selector: 'slider-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class SliderHeaderComponent extends BaseComponent implements OnInit, OnChanges {

  @Input('user') user: any = null;
  constructor(
      public override injector: Injector,
  ) {
    super(injector);


  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
  }

}
