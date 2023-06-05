import { PreviewActivityChangesComponent } from './../preview-activity-changes/preview-activity-changes.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { EventsController } from 'app/+events/controllers';
import { ActivatedRoute } from '@angular/router';
import { ngbModalOptions } from '@shared/default-values';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { EventAuditEnum } from 'app/+events/models';

@Component({
  selector: 'activity-item-content',
  templateUrl: './activity-item-content.component.html',
  styleUrls: ['./activity-item-content.component.scss']
})

export class ActivityItemContentComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() activity: any;
  auditEnum: EventAuditEnum;

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
