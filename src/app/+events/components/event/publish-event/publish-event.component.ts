import { Component, Injector, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { takeUntil } from "rxjs/operators";
import { BaseComponent } from "@shared/base/base.component";

@Component({
  selector: 'app-publish-event',
  templateUrl: './publish-event.component.html',
  styleUrls: ['./publish-event.component.scss']
})
export class PublishEventComponent extends BaseComponent implements OnInit {

  @Input('title') title: any;
  @Input('url') url: any;

  constructor(public override injector: Injector, public modalService: NgbActiveModal) {
    super(injector);
  }

  ngOnInit(): void {
  }

  publish() {
    this.httpService.PATCH(this.url)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.modalService.close(true);
        this.notificationService.success('Event Publish', `'${this.title}' is successfully Published! 🎉`);
      });
  }

}
