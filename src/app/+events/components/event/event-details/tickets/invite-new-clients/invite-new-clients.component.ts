import { TicketTypeValidator } from 'app/+events/validators';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TicketTypeModel } from 'app/+events/models';
import { BaseComponent } from '@shared/base/base.component';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketTypesController } from 'app/+events/controllers';

@Component({
  selector: 'invite-new-clients',
  templateUrl: './invite-new-clients.component.html',
  styleUrls: ['./invite-new-clients.component.scss']
})

export class InviteNewClientsComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() ticketType: TicketTypeModel;
  @Input() eventId: string;
  @Output() loadTicket = new EventEmitter();

  invitedClients: any[] = [];

  clientsEmails: string[] = [];

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
    this.loadInvitedClients();
  }

  initializeForm() {
    this.form = this._formBuilder.group({
      email: new FormControl(null, TicketTypeValidator.email),
      clientsEmails: []
    });
  }

  loadInvitedClients(){
    this.httpService.GET(TicketTypesController.GetInvitedClients(this.eventId, this.ticketType?.id))
      .subscribe(res => {
        this.invitedClients = res;
      })
  }

  submit(): any {
    if (this.form.invalid) {
      return;
    }
    let body = this.form.getRawValue();
    body.clientsEmails = this.clientsEmails;

    this.httpService.PATCH(TicketTypesController.AddNewInvitedClients(this.eventId, this.ticketType?.id), body)
      .subscribe(res => {
        this.modalService.close(true);
        this.notificationService.success('Update Clients', 'Your changes successfully updated! 🎉');
        this.loadInvitedClients();
        this.loadTicket.emit();
      });
  }

  addEmail() {
    if(this.form?.get('email').value == '' || this.form?.get('email').value == null || this.form?.get('email').value == undefined) return;
    if (this.form?.get('email')?.errors) return;
    if (this.clientsEmails.includes(this.form?.get('email').value)) {
      this.notificationService.error("Email Duplication", "This email has been added before.");
      return;
    }
    this.clientsEmails?.push(this.form?.get('email').value);
    this.form?.get('email').patchValue(null);
    this.form.markAsDirty();
  }

  deleteEmail(index: number) {
    this.clientsEmails?.splice(index, 1);
  }

}
