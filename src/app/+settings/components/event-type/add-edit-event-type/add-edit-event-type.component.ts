import { AfterViewInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@shared/base/base.component';
import { EventTypesController } from 'app/+settings/controllers/EventTypesController';
import { EventTypesValidator } from 'app/+settings/validators/event-types.validators';

@Component({
  selector: 'app-add-edit-event-types',
  templateUrl: './add-edit-event-type.component.html',
  styleUrls: ['./add-edit-event-type.component.scss']
})
export class AddEditEventTypeComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() mode: string = 'add';
  @Input() formFilters: FormGroup;
  @Input() eventType: any;
  form: FormGroup;

  constructor(public override injector: Injector, public modalService: NgbActiveModal,
    private formBuilder: FormBuilder) {
    super(injector);
  }
  ngAfterViewInit(): void {
    (<HTMLElement>document.getElementById("cancel")).focus();
  }

  ngOnInit(): void {
    this.initForm();
  }


  private initForm(): void {
    this.form = this.formBuilder.group({
      name: new FormControl(null, EventTypesValidator.name),
      description: new FormControl(null, EventTypesValidator.description),
    });

    this.form?.controls['name'].patchValue(this.eventType?.name);
    this.form.controls['description'].patchValue(this.eventType?.description);
  }

  isInvalid(controllerName: string): boolean {
    return this.form.get(controllerName)?.errors && this.form.touched;
  }

  submit() {
    let body = this.form?.getRawValue();
    if(body.description === '')
      body.description = null;

    if (this.mode == 'add') {
      this.httpService.POST(EventTypesController.Create, body)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.modalService.close(true);
          this.notificationService.success('Type is Added', 'New Type is added successfully! 🎉');
        });
    } else if (this.mode == 'edit') {
      this.httpService.PUT(EventTypesController.Update(this.eventType.id), body)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.modalService.close(true);
          this.notificationService.success('Type is Updated', 'Type is updated successfully! 🎉');
        });
    }

  }
}
