import { BaseComponent } from '@shared/base/base.component';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormControl, UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComplementaryTicketValidator } from 'app/+events/validators';
import { ComplementaryTicketController } from 'app/+events/controllers/ComplementaryTicketController';

@Component({
  selector: 'add-complementary-ticket',
  templateUrl: './add-complementary-ticket.component.html',
  styleUrls: ['./add-complementary-ticket.component.scss']
})

export class AddComplementaryTicketComponent extends BaseComponent implements OnInit, OnChanges {
  form!: UntypedFormGroup;
  @Input() eventId: string;
  @Output("notifyParent") notifyParent = new EventEmitter();
  @Output("loadEvent") loadEvent = new EventEmitter();

  clientsEmails: string[] = [];

  constructor(
    public override injector: Injector,
    public modalService: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      description: new FormControl(null, ComplementaryTicketValidator.description),
      quantity: new FormControl(null, ComplementaryTicketValidator.ticketQuantity),
      email: new FormControl(null, ComplementaryTicketValidator.email),
      clientsEmails: []
    });
  }

  submit(): any {
    if (this.form.invalid) {
      return;
    }
    let body = this.form.getRawValue();
    body.clientsEmails = this.clientsEmails;

    this.httpService
      .POST(ComplementaryTicketController.CreateComplementaryTicket(this.eventId), body)
      .subscribe((res) => {
        this.modalService.close(true);
        this.notificationService.success(
          "Create Complementary Ticket",
          "Your ticket successfully created! 🎉"
        );
        this.notifyParent.emit();
        this.loadEvent.emit();
      });
  }
  validateBtn(): boolean {
    if (this.form?.get('email')?.errors) return true;
    else if (this.clientsEmails?.length == this.form?.get('quantity').value || this.form?.get('quantity').value === null) {
      return true;
    }
    return false;
  }

  addEmail() {
    if (this.form?.get('email')?.errors) return;
    if (this.clientsEmails?.length == this.form?.get('quantity').value || this.form?.get('quantity').value === null) {
      this.notificationService.error("Quantity Exceeded", "Number of emails exceeds quantity.");
      return;
    }
    let emailValue = this.form?.get('email').value;
    if (emailValue === '' || emailValue === null) return;
    for (let i = 0; i < this.clientsEmails?.length; i++) {
      if (this.clientsEmails[i] === emailValue) {
        this.notificationService.error("Email Duplication", "This email has been added before.");
        return;
      }
    }
    this.clientsEmails?.push(this.form?.get('email').value);
    this.form?.get('email').patchValue(null);
  }

  deleteEmail(index: number) {
    this.clientsEmails?.splice(index, 1);
  }

  isNotInt(val: string): boolean {
    return parseInt(val) > 2147483647;
  }

  validValues(): boolean {
    let body = this.form.getRawValue();
    return this.isNotInt(body.quantity);
  }
}
