import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from "@shared/base/base.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { takeUntil } from "rxjs/operators";
import { EventMembersController } from 'app/+events/controllers';


@Component({
  selector: 'app-unassign-members',
  templateUrl: './unassign-members.component.html',
  styleUrls: ['./unassign-members.component.scss']
})
export class UnassignMembersComponent extends BaseComponent implements OnInit {
  @Input('selectedRows') selectedRows: any[];
  @Input('eventId') eventId: any;

  constructor(public override injector: Injector, public modalService: NgbActiveModal) {
    super(injector);
  }

  ngOnInit(): void {
  }

  delete() {
    let body = { memberIds: this.selectedRows }
    this.httpService.PUT(EventMembersController.RemoveMembersFromEvent(this.eventId), body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.modalService.close(true);
        this.notificationService.success('Members have been removed from the event', 'Your Changes are saved successfully! 🎉');
      });
  }

}
