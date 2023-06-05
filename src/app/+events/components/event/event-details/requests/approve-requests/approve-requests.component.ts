import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormArray, FormControl, UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "@shared/base/base.component";
import { DeactivateValidator } from "@shared/components/deactivate/deactivate.validators";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'approve-requests',
    templateUrl: './approve-requests.component.html',
    styleUrls: ['./approve-requests.component.scss']
  })
  
  export class ApproveRequestsComponent extends BaseComponent implements OnInit {
    
    @Input('title') title: any;
    @Input('url') url: any;
    @Input('reason') reason: boolean = true;
    @Input('requests') requests: any[] = [];
    @Input('eventId') eventId: string;

    ticketTypes: {
      title: string,
      requested: number,
      availableTickets: number,
      remainingTickets: number,
      purchasedTickets: number, 
      extra: number, totalTickets: number, 
      approvedTickets: number}[] = [];

    goNormal: boolean = true;

    form: UntypedFormGroup;

  constructor(
    public override injector: Injector,
    private router : Router,
     public modalService: NgbActiveModal,
     private _formBuilder: UntypedFormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.intializeForm();
    this.requests.forEach(x => {
        this.RequestsIds.push(new FormControl(x?.requestId));
        let exist = this.ticketTypes.filter(y => y.title.toLowerCase().trim() == x.title.toLowerCase().trim());
        if(exist.length > 0){
            exist[0].requested += x.quantity;
            exist[0].extra = exist[0].extra + x.quantity;

            if(exist[0]?.extra > 0){
              this.goNormal = false;
            }
        }
        else {
            this.ticketTypes.push({
                title: x.title,
                requested: x.quantity,
                availableTickets: x.totalTickets - x.currentApprovedQuantity,
                remainingTickets: x.currentApprovedQuantity - x.purchasedTickets,
                purchasedTickets: x.purchasedTickets,
                totalTickets: x.totalTickets,
                approvedTickets: x.currentApprovedQuantity,
                extra: x.quantity - (x.totalTickets - x.currentApprovedQuantity)
            });

            if(x.quantity - (x.totalTickets - x.currentApprovedQuantity) > 0)
              this.goNormal = false;
        }

    });

    console.log(this.ticketTypes);
    console.log(this.goNormal);
  }

  intializeForm() {
    this.form = this._formBuilder.group({
      requestsIds: new FormArray([]),  
    });
  }

  get RequestsIds(): FormArray<FormControl> {
    return this.form.get('requestsIds') as FormArray<FormControl>;
  }

  Approve() {
    let body = this.form.getRawValue();
    console.log(body);
    this.httpService.PATCH(this.url, body)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.modalService.close(true);
          this.notificationService.success('Approved', `${this.requests.length > 1 ? 'Requests' : 'Request'} approved successfully 🎉`);
        });
  }

  getDetails(activeId: number){
    this.router.navigate([`/events/${this.eventId}`], {
      queryParams: {
        activeId: activeId
      }
    }).then(res => {
      this.modalService.close(true);
    })
  }

  }