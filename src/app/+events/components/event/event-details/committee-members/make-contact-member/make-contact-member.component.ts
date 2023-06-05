import { Component, Injector, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-make-contact-member',
  templateUrl: './make-contact-member.component.html',
  styleUrls: ['./make-contact-member.component.scss']
})
export class MakeContactMemberComponent extends BaseComponent implements OnInit {
  @Input('title') title: any;
  @Input('url') url: any;
  @Input('isContact') isContact: boolean = true;

  constructor(public override injector: Injector, public modalService: NgbActiveModal) {
    super(injector);
  }

  ngOnInit(): void {
  }

  submit() {
    this.httpService.PUT(this.url)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.modalService.close(true);
        this.notificationService.success(this.isContact ? 'Contact made successfully' : 'Contact removed successfully', `Your changes is successfully ! 🎉`);
      });
  }


}
