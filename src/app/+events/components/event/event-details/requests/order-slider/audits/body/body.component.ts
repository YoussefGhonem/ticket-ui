import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: 'request-audits-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})

export class RequestAuditsBodyComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() activity: any;

  constructor(
      public override injector: Injector
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {

  }

  returnJsonData(x: any, prop: string) {
    return JSON.parse(x)[prop];
  }

}
