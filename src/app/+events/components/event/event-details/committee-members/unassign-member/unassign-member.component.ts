import { Component, Injector, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-unassign-member',
  templateUrl: './unassign-member.component.html',
  styleUrls: ['./unassign-member.component.scss']
})
export class UnassignMemberComponent extends BaseComponent implements OnInit {
  @Input('title') title: any;
  @Input('url') url: any;

  constructor(public override injector: Injector, public modalService: NgbActiveModal) {
    super(injector);
  }

  ngOnInit(): void {
  }

  Unassign() {
    this.httpService.DELETE(this.url)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.modalService.close(true);
        this.notificationService.success('Member has been removed from the event', `Your changes is successfully ! 🎉`);
      });
  }

}
