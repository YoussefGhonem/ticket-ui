import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from "@shared/base/base.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent extends BaseComponent implements OnInit {
  @Input('title') title: any;
  @Input('url') url: any;

  constructor(public override injector: Injector, public modalService: NgbActiveModal) {
    super(injector);
  }

  ngOnInit(): void {
  }

  delete() {
    this.httpService.DELETE(this.url)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.modalService.close(true);
          this.notificationService.success('Deleted', `'${this.title}' is successfully deleted! 🎉`);
        });
  }
}
