import {
  Component,
  Injector,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { BaseComponent } from "@shared/base/base.component";
import { MembersController } from "app/+vendors/controllers";
import { debounceTime, takeUntil } from "rxjs/operators";
import { SortOptionsEnum } from "@shared/models/BaseModels/enums";
import { CommitteeMembersTabTableComponent } from "./committee-members-tab-table/committee-members-tab-table";

@Component({
  selector: "committee-members-tab",
  templateUrl: "./committee-members-tab.component.html",
  styleUrls: ["./committee-members-tab.component.scss"],
})
export class CommitteeMembersTabComponent
  extends BaseComponent
  implements OnInit
{
   @Input('user') user:any;
    form: FormGroup;
    sortedEnum = SortOptionsEnum;
    total:number=10;
    members:any[];
    vendorId:any;
    @ViewChild(CommitteeMembersTabTableComponent) memberTableComponent : CommitteeMembersTabTableComponent;
  constructor(public override injector: Injector,private _formBuilder: FormBuilder,
    ){
    super(injector);
}

  ngOnInit(): void {
    console.log(this.user);
    this.initSearchForm();
    this.vendorId=this.user.businessId;
    this.loadCommitteeMembers();
  }

  loadCommitteeMembers() {

    let filters = this.form.getRawValue();
    filters.createdDate = filters.createdDate?.toUTCString();

    this.httpService
      .GET(MembersController.GetMembersForVendor(this.vendorId),filters)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.members = res?.data;
        this.total=res?.total;
        console.log("committee Members from tab component : ", res?.data);
      });
      this.memberTableComponent.loadTable(filters);
  }
  search() {
    this.loadCommitteeMembers();
  }

  private initSearchForm(): void {
    this.form = this._formBuilder.group({
       // Pagination
       pageNumber: new FormControl(1),
       pageSize: new FormControl(10),
       //filters
       searchWord:new FormControl(null),
      //vendorId: new FormControl(null),
       createdDate: new FormControl(null),
       isActive: new FormControl(null),
       isLock: new FormControl(null),
       currentTimeZoneDifferenceInMinutes: new FormControl((new Date()).getTimezoneOffset()
      ),
    });

    this.form.controls['searchWord'].valueChanges
    .pipe(debounceTime(500))
    .subscribe(res => {
      this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
      this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
      this.loadCommitteeMembers();
    });
  }
  pageChange(pageNumber: number) {
    this.form.controls['pageNumber'].patchValue(pageNumber, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.loadCommitteeMembers()
  }
}
