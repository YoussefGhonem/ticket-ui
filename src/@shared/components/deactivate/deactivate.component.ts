import { DeactivateValidator } from './deactivate.validators';
import { UntypedFormGroup, UntypedFormBuilder, FormControl } from '@angular/forms';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { takeUntil } from "rxjs/operators";
import { BaseComponent } from "@shared/base/base.component";

@Component({
  selector: 'app-deactivate',
  templateUrl: './deactivate.component.html',
  styleUrls: ['./deactivate.component.scss']
})
export class DeactivateComponent extends BaseComponent implements OnInit {

  @Input('title') title: any;
  @Input('item') item: string = 'user';
  @Input('url') url: any;
  @Input('reason') reason: boolean = false;
  form: UntypedFormGroup;

  constructor(
    public override injector: Injector,
     public modalService: NgbActiveModal,
     private _formBuilder: UntypedFormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.intializeForm();
  }

  intializeForm() {
    if(!this.reason) return;
    this.form = this._formBuilder.group({
      reason: new FormControl(null, DeactivateValidator.reason)
    });
  }

  deactivateIt() {
    let body = this.reason ? this.form.getRawValue() : {}
    console.log(body);
    this.httpService.PATCH(this.url, body)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.modalService.close(true);
          this.notificationService.success('Deactivated', `'${this.title}' is successfully deactivated! 🎉`);
        });
  }

  get NotValid(): boolean {
    if(this.reason == true)
      return this.form.invalid;
    return false;
  }

}
