import { TicketTypeModel } from 'app/+events/models';
import { TicketTypeValidator } from 'app/+events/validators';
import { BaseComponent } from "@shared/base/base.component";
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, } from "@angular/core";
import { NgbActiveModal, NgbPanelChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormControl, UntypedFormGroup } from "@angular/forms";
import { TicketTypesController } from "app/+events/controllers";

@Component({
  selector: "update-ticket-type",
  templateUrl: "./update-ticket-type.component.html",
  styleUrls: ["./update-ticket-type.component.scss"],
})
export class UpdateTicketTypeComponent
  extends BaseComponent
  implements OnInit, OnChanges {
  form!: UntypedFormGroup;
  @Input() eventId: string;
  @Input() percentage: number;
  @Input() ticketType: TicketTypeModel;
  @Output("notifyParent") notifyParent = new EventEmitter();


  lastPanelId: string = null;
  defaultPanelId: string = "panel2";

  panelShadow($event: NgbPanelChangeEvent, shadow) {
    console.log($event);

    const { nextState } = $event;

    const activePanelId = $event.panelId;
    const activePanelElem = document.getElementById(activePanelId);

    if (!shadow.isExpanded(activePanelId)) {
      activePanelElem.parentElement.classList.add("open");
    }

    if (!this.lastPanelId) this.lastPanelId = this.defaultPanelId;

    if (this.lastPanelId) {
      const lastPanelElem = document.getElementById(this.lastPanelId);

      if (this.lastPanelId === activePanelId && nextState === false)
        activePanelElem.parentElement.classList.remove("open");
      else if (this.lastPanelId !== activePanelId && nextState === true) {
        lastPanelElem.parentElement.classList.remove("open");
      }

    }

    this.lastPanelId = $event.panelId;
  }

  constructor(
    public override injector: Injector,
    public modalService: NgbActiveModal,
    private router: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error("Method not implemented.");
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      title: new FormControl(this.ticketType?.title, TicketTypeValidator.title),
      description: new FormControl(this.ticketType?.description, TicketTypeValidator.description),
      price: new FormControl(this.ticketType?.ticketPrice, TicketTypeValidator.ticketPrice),
      quantity: new FormControl(this.ticketType?.totalTickets, TicketTypeValidator.ticketQuantity),
      maxTicketsPerPurchase: new FormControl(this.ticketType?.maxTicketsPerPurchase, TicketTypeValidator.maxPurchasePerTicketType),
      approvalEnabled: new FormControl(this.ticketType?.approvalEnabled),
      email: new FormControl(null, TicketTypeValidator.email),
      clientsEmails: [],
    });
  }

  get validateMaxTickets(): boolean {
    let quantity = Number(this.form.controls['quantity'].value);
    let maxTicketsPerPurchase = Number(this.form.controls['maxTicketsPerPurchase'].value);

    return maxTicketsPerPurchase > quantity
  }

  submit(): any {
    if (this.form.invalid) {
      return;
    }
    let body = this.form.getRawValue();
    body.clientsEmails = this.ticketType?.clientsEmails;
    body.maxTicketsPerPurchase = body.approvalEnabled ? 0 : body.maxTicketsPerPurchase;
    console.log("body", body);

    this.httpService
      .PUT(TicketTypesController.UpdateEventTicketType(this.eventId, this.ticketType?.id), body)
      .subscribe((res) => {
        this.modalService.close(true);
        this.notificationService.success(
          "Update Ticket Type",
          "Your changes successfully updated! 🎉"
        );
        this.notifyParent.emit();
      });
  }

  getPercentage() {
    return this.percentage + "%";
  }

  getTotalPrice() {
    let curPrice = this.form.getRawValue().price;
    curPrice = curPrice * (this.percentage / 100) + curPrice;
    return curPrice.toFixed(2);
  }

  addEmail() {
    if (this.form?.get('email')?.errors) return;
    let emailValue = this.form?.get('email').value;
    if (emailValue === '' || emailValue === null) return;
    for (let i = 0; i < this.ticketType?.clientsEmails?.length; i++) {
      if (this.ticketType?.clientsEmails[i] === emailValue) {
        this.notificationService.error("Email Duplication", "This email has been added before.");
        return;
      }
    }
    this.ticketType?.clientsEmails?.push(this.form?.get('email').value);
    this.form?.get('email').patchValue(null);
    this.form.markAsDirty();
  }


  isNotInt(val: string): boolean {
    return parseInt(val) > 2147483647;
  }

  isNotDecimal(val: any): boolean {
    console.log(val);
    console.log("val", String(val));

    return val > 79228162514264337593543950335;
  }

  deleteEmail(index: number) {
    this.ticketType?.clientsEmails?.splice(index, 1);
    this.form.markAsDirty();
  }

  onToggle() {
    this.form.controls['approvalEnabled'].patchValue(!this.form.getRawValue().approvalEnabled);
    this.form.markAsDirty();
  }

  validValues(): boolean {
    let body = this.form.getRawValue();
    return this.isNotDecimal(body.price) || this.isNotInt(body.quantity) || this.isNotInt(body.maxTicketsPerPurchase);
  }
}
