import { ComplementaryTicketValidator } from 'app/+events/validators';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TicketTypeModel } from 'app/+events/models';
import { BaseComponent } from '@shared/base/base.component';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComplementaryTicketController } from 'app/+events/controllers/ComplementaryTicketController';

@Component({
  selector: 'update-complementary',
  templateUrl: './update-complementary.component.html',
  styleUrls: ['./update-complementary.component.scss']
})

export class UpdateComplementaryComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() complementary: TicketTypeModel;
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
      quantity: new FormControl(this.complementary?.totalTickets, ComplementaryTicketValidator.ticketQuantity),
      email: new FormControl(null, ComplementaryTicketValidator.email),
      clientEmails: []
    });
  }

  submit(): any {
    if (this.form.invalid) {
      return;
    }
    let body = this.form.getRawValue();
    body.clientEmails = this.complementary?.clientsEmails;

    this.httpService.PUT(ComplementaryTicketController.UpdateComplementary(this.eventId), body)
      .subscribe(res => {
        this.modalService.close(true);
        this.notificationService.success('Update ticket type', 'Your changes successfully updated! 🎉');
        this.loadComplementary.emit();
      });
  }

  addEmail() {
    if (this.form?.get('email')?.errors) return;
    if (this.complementary?.clientsEmails?.length == this.form?.get('quantity').value
      || this.form?.get('quantity').value === null) {
      this.notificationService.error("Quantity Exceeded", "Number of emails exceeds quantity.");
      return;
    }
    let emailValue = this.form?.get('email').value;
    if (emailValue === '' || emailValue === null) return;
    for (let i = 0; i < this.complementary?.clientsEmails?.length; i++) {
      if (this.complementary?.clientsEmails[i] === emailValue) {
        this.notificationService.error("Email Duplication", "This email has been added before.");
        return;
      }
    }
    this.complementary?.clientsEmails?.push(this.form?.get('email').value);
    this.form?.get('email').patchValue(null);
    this.form.markAsDirty();

  }

  isNotInt(val: string): boolean {
    return parseInt(val) > 2147483647;
  }


  deleteEmail(index: number) {
    this.complementary?.clientsEmails?.splice(index, 1);
    this.form.markAsDirty();

  }

  validValues(): boolean {
    let body = this.form.getRawValue();
    return  this.isNotInt(body.quantity);
  }

}
