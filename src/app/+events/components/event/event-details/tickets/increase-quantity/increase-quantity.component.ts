import { TicketTypeValidator } from './../../../../../validators/ticket-type-validators';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, FormBuilder } from '@angular/forms';
import { BaseComponent } from '@shared/base/base.component';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketTypesController } from 'app/+events/controllers/TicketTypesController';
import { TicketTypeModel } from 'app/+events/models';

@Component({
  selector: 'increase-quantity',
  templateUrl: './increase-quantity.component.html',
  styleUrls: ['./increase-quantity.component.scss']
})

export class IncreaseQuantityComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() ticketType: TicketTypeModel;
  @Input() eventId: string;
  @Output() loadComplementary = new EventEmitter();

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
  }

  initializeForm() {
    this.form = this._formBuilder.group({
      quantity: new FormControl(0, TicketTypeValidator.ticketQuantity),
    });
  }

  submit(): any {
    if (this.form.invalid) {
      return;
    }
    let body = this.form.getRawValue();

    this.httpService.PATCH(TicketTypesController.IncreaseTicketsQuantity(this.eventId, this.ticketType?.id), body)
      .subscribe(res => {
        this.modalService.close(true);
        this.notificationService.success('Update Quantity', 'Your changes successfully updated! 🎉');
        this.loadComplementary.emit();
      });
  }

  defaultfulldecrement() {
    let quantityControl = this.form.controls['quantity'];
    quantityControl.patchValue(quantityControl.value - 1);
  }

  defaultfullincrement() {
    let quantityControl = this.form.controls['quantity'];
    quantityControl.patchValue(quantityControl.value + 1);
  }

}
