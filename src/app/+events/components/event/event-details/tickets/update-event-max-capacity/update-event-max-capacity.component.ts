import { TicketTypeValidator } from './../../../../../validators/ticket-type-validators';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, FormBuilder } from '@angular/forms';
import { BaseComponent } from '@shared/base/base.component';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketTypesController } from 'app/+events/controllers/TicketTypesController';
import { EventStatusEnum, TicketTypeModel } from 'app/+events/models';
import { EventsController } from 'app/+events/controllers';

@Component({
  selector: 'update-event-max-capacity',
  templateUrl: './update-event-max-capacity.component.html',
  styleUrls: ['./update-event-max-capacity.component.scss']
})

export class UpdateMaxCapacityComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() eventId: string;
  @Input('maxCapacity') maxCapacity: number | null;
  @Input('eventStatus') eventStatus: EventStatusEnum = null;
  @Output() loadEvent = new EventEmitter();

  eventStatusEnum = EventStatusEnum;

  form: UntypedFormGroup;
  constructor(
    public override injector: Injector,
    private _formBuilder: UntypedFormBuilder,
    public modalService: NgbActiveModal
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.initializeForm();
    console.log(this.maxCapacity);
  }

  initializeForm() {
    this.form = this._formBuilder.group({
      unlimited: new FormControl<boolean>(this.eventStatus == 1 ? this.maxCapacity == null : {value: this.maxCapacity == null, disabled: true}),
      maxCapacity: new FormControl(this.maxCapacity ?? 0),
    });
  }

  submit(): any {
    if (this.form.invalid) {
      return;
    }
    let body = this.form.getRawValue();
    console.log(body);
    body.maxCapacity = this.form.getRawValue().unlimited ? null : body.maxCapacity;

    this.httpService.PATCH(EventsController.UpdateEventMaxCapacity(this.eventId), body)
      .subscribe(res => {
        this.modalService.close(true);
        this.notificationService.success('Update Maximum Capacity', 'Your changes successfully updated! 🎉');
        this.loadEvent.emit();
      });
  }

  defaultfulldecrement() {
    let maxCapacityControl = this.form.controls['maxCapacity'];
    maxCapacityControl.patchValue(maxCapacityControl.value - 1);
    this.form.markAsDirty();
  }

  defaultfullincrement() {
    let maxCapacityControl = this.form.controls['maxCapacity'];
    maxCapacityControl.patchValue(maxCapacityControl.value + 1);
    this.form.markAsDirty();
  }

  isNotInt(val: string): boolean {
    return parseInt(val) > 2147483647;
  }

  validValues(): boolean {
    let body = this.form.getRawValue();
    return this.isNotInt(body.maxCapacity);
  }
}
