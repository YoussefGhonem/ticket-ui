import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from "@shared/base/base.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { takeUntil } from "rxjs/operators";
import { Validators } from 'angular-reactive-validation';
import { EventValidator } from 'app/+events/validators';

@Component({
  selector: 'app-cancel-event',
  templateUrl: './cancel-event.component.html',
  styleUrls: ['./cancel-event.component.scss']
})
export class CancelEventComponent extends BaseComponent implements OnInit {
  @Input('title') title: any;
  @Input('url') url: any;
  form: FormGroup;


  constructor(public override injector: Injector, private _formBuilder: UntypedFormBuilder, public modalService: NgbActiveModal) {
    super(injector);
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.form = this._formBuilder.group({
      reason: new FormControl(null, EventValidator.reason),
    });
  }

  cancel() {
    let body = this.form.getRawValue();
    this.httpService.PATCH(this.url, body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.modalService.close(true);
        this.notificationService.success('Canceled', `'${this.title}' is successfully deleted! 🎉`);
      });
  }
}
