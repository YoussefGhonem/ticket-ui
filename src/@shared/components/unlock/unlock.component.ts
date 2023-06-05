import { Component, Injector, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { takeUntil } from "rxjs/operators";
import { BaseComponent } from "@shared/base/base.component";

@Component({
  selector: 'app-unlock',
  templateUrl: './unlock.component.html',
  styleUrls: ['./unlock.component.scss']
})
export class UnlockComponent extends BaseComponent implements OnInit {

  @Input('title') title: any;
  @Input('id') id: any;
  @Input('url') url: any;

  constructor(public override injector: Injector, public modalService: NgbActiveModal) {
    super(injector);
  }

  ngOnInit(): void {
  }

  unlock() {
    this.httpService.PATCH(this.url)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.modalService.close(true);
          this.notificationService.success('Unlock', 'Your changes successfully updated! 🎉');
        });
  }
}
