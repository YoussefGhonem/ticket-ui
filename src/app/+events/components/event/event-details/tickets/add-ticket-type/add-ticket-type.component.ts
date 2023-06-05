import { TicketTypeValidator } from 'app/+events/validators';
import { BaseComponent } from "@shared/base/base.component";
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, } from "@angular/core";
import { NgbActiveModal, NgbPanelChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormControl, UntypedFormGroup } from "@angular/forms";
import { TicketTypesController } from "app/+events/controllers";

@Component({
  selector: "add-ticket-type",
  templateUrl: "./add-ticket-type.component.html",
  styleUrls: ["./add-ticket-type.component.scss"],
})
export class AddTicketTypeComponent
  extends BaseComponent
  implements OnInit, OnChanges {
  form!: UntypedFormGroup;
  @Input() eventId: string;
  @Input() percentage: number;
  @Output("notifyParent") notifyParent = new EventEmitter();
  @Output('loadEvent') loadEvent = new EventEmitter();


  clientsEmails: string[] = [];

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
      title: new FormControl(null, TicketTypeValidator.title),
      description: new FormControl(null, TicketTypeValidator.description),
      price: new FormControl(0, TicketTypeValidator.ticketPrice),
      quantity: new FormControl('0', TicketTypeValidator.ticketQuantity),
      maxTicketsPerPurchase: new FormControl('0', TicketTypeValidator.maxPurchasePerTicketType),
      approvalEnabled: new FormControl(false),
      email: new FormControl(null, TicketTypeValidator.email),
      clientsEmails: []
    });
  }
  get validateMaxTickets(): boolean {
    if(this.form.controls['approvalEnabled'].value) return false;
    let quantity = Number(this.form.controls['quantity'].value);
    let maxTicketsPerPurchase = Number(this.form.controls['maxTicketsPerPurchase'].value);

    return maxTicketsPerPurchase > quantity
  }
  isNotDecimal(val: any): boolean {
    return val > 79228162514264337593543950335;
  }
  submit(): any {
    if (this.form.invalid) {
      return;
    }
    let body = this.form.getRawValue();
    body.clientsEmails = this.clientsEmails;
    body.maxTicketsPerPurchase = body.approvalEnabled ? 0 : body.maxTicketsPerPurchase;

    this.httpService
      .POST(TicketTypesController.CreateEventTicketType(this.eventId), body)
      .subscribe((res) => {
        this.modalService.close(true);
        this.notificationService.success(
          "Create Ticket Type",
          "Your ticket successfully created! 🎉"
        );
        this.notifyParent.emit();
        this.loadEvent.emit();
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

  onToggle() {
    this.form.controls['approvalEnabled'].patchValue(!this.form.getRawValue().approvalEnabled);
  }

  isNotInt(val: string): boolean {
    if(parseInt(val) > 2147483647){
      // this.form.controls['quantity'].setErrors();
    }
    return parseInt(val) > 2147483647;
  }


  validValues(): boolean {
    let body = this.form.getRawValue();
    return this.isNotDecimal(body.price) || this.isNotInt(body.quantity) || (body.approvalEnabled ? false : this.isNotInt(body.maxTicketsPerPurchase));
  }
}
