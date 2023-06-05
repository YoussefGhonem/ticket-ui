import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';


@Component({
  selector: 'preview-activity-changes',
  templateUrl: './preview-activity-changes.component.html',
  styleUrls: ['./preview-activity-changes.component.scss']
})
export class PreviewActivityChangesComponent extends BaseComponent implements OnInit {

    @Input('property') property: string;
    @Input('value') value: string;
  constructor(
      public override injector: Injector,
      public modalService: NgbActiveModal
      ) {
    super(injector);
  }

  ngOnInit(): void {

  }

}
