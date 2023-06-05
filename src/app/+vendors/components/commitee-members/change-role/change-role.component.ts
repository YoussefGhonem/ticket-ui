import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from "@shared/base/base.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { takeUntil } from "rxjs/operators";
import { MemberAllowedActions } from 'app/+vendors/models';

@Component({
  selector: 'change-role',
  templateUrl: './change-role.component.html',
  styleUrls: ['./change-role.component.scss']
})
export class ChangeRoleComponent extends BaseComponent implements OnInit {
  @Input('title') title: any;
  @Input('role') action: MemberAllowedActions;
  @Input('url') url: any;
  memberAllowedAction = MemberAllowedActions;
  actionAsString: string;

  constructor(public override injector: Injector, public modalService: NgbActiveModal) {
    super(injector);
  }

  ngOnInit(): void {
    this.actionAsString = this.action == MemberAllowedActions.UpgradeToAdmin ? 'Upgrade' : 'Downgrade';
  }

  change() {
    this.httpService.PATCH(this.url)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.modalService.close(true);
        let message: any = this.action == this.memberAllowedAction.UpgradeToAdmin ?
          { title: 'Upgraded', body: `'${this.title}' is successfully upgraded! 🎉` } :
          { title: 'Downgraded', body: `'${this.title}' is successfully downgraded! 🎉` }
        this.notificationService.success(message.title, message.body);
      });
  }
}
