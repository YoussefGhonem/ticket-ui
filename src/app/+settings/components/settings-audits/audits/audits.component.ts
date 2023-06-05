import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';


@Component({
  selector: 'audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.scss']
})


export class AuditsComponent extends BaseComponent implements OnInit, OnChanges {

  @Input('audits') audits: any[];


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
    if(!item?.extraInfo?.hasDescription) return false;
    return item?.extraInfo?.hasDescription;
  }

}
