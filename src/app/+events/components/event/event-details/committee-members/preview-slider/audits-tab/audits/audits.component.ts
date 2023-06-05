import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';


@Component({
  selector: 'user-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.scss']
})


export class MemberAuditsComponent extends BaseComponent implements OnInit, OnChanges {

  @Input('userAudits') userAudits: any[];


  constructor(
      public override injector: Injector
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {

  }

  isExpandable(item: any) {
    return item.extraInfo.hasDescription;
  }

}
