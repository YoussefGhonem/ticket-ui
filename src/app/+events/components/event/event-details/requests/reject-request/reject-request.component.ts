import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormArray, FormControl, UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "@shared/base/base.component";
import { DeactivateValidator } from "@shared/components/deactivate/deactivate.validators";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'reject-requests',
    templateUrl: './reject-request.component.html',
    styleUrls: ['./reject-request.component.scss']
  })
  
  export class RejectRequestsComponent extends BaseComponent implements OnInit {
    
    @Input('title') title: any;
    @Input('url') url: any;
    @Input('reason') reason: boolean = true;
    @Input('requests') requests: any[] = [];
  form: UntypedFormGroup;

  constructor(
    public override injector: Injector,
     public modalService: NgbActiveModal,
     private _formBuilder: UntypedFormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.intializeForm();
    this.requests.forEach(x => {
        this.RequestsIds.push(new FormControl(x?.requestId));
    })
  }

  intializeForm() {
    if(!this.reason) return;
    this.form = this._formBuilder.group({
      requestsIds: new FormArray([]),  
      reason: new FormControl(null, DeactivateValidator.reason)
    });
  }

  get RequestsIds(): FormArray<FormControl> {
    return this.form.get('requestsIds') as FormArray<FormControl>;
  }

  Reject() {
    let body = this.reason ? this.form.getRawValue() : {}
    console.log(body);
    this.httpService.PATCH(this.url, body)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.modalService.close(true);
          this.notificationService.success('Rejected', `${this.requests.length > 1 ? 'Requests' : 'Request'} rejected successfully 🎉`);
        });
  }

  get NotValid(): boolean {
    if(this.reason == true)
      return this.form.invalid;
    return false;
  }
  }