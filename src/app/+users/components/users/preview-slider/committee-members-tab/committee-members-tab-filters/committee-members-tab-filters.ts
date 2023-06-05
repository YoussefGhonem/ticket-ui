import {
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormBuilder } from "@angular/forms";
import { BaseComponent } from "@shared/base/base.component";
import { SortOptionsEnum } from "@shared/models/BaseModels/enums";
import { IsActiveStatusEnum, IsLockedStatusEnum } from "app/+users/models";
import { MembersController } from "app/+vendors/controllers";
import * as saveAs from "file-saver";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "members-tab-filters",
  templateUrl: "./committee-members-tab-filters.html",
  styleUrls: ["./committee-members-tab-filters.scss"],
})
export class CommitteeMembersTabFiltersComponent
  extends BaseComponent
  implements OnInit
{
  public dropdownOpen: boolean = false;
  testBoolean: boolean = false;
  @Input("form") form: FormGroup;
  @Input("user") vendorId: any;
  @Input("hasMembers") hasMembers: boolean;
  sortedEnum = SortOptionsEnum;
  @Output("notify") notify = new EventEmitter<boolean>();
  isActiveStatus: any[];
  isLockedStatus: any[];

  constructor(
    public override injector: Injector,
    private _formBuilder: FormBuilder
  ) {
    super(injector);
  }
  ngOnInit(): void {
    this.getIsActiveStatus();
    this.getIsLockedStatus();

    console.log("user from filter section: ", this.vendorId);
  }
  private getIsActiveStatus() {
    this.isActiveStatus = Object.keys(IsActiveStatusEnum).map(id => ({ id, name: IsActiveStatusEnum[id] })).slice(0, 3);
  }

  private getIsLockedStatus() {
    this.isLockedStatus = Object.keys(IsLockedStatusEnum).map(id => ({ id, name: IsLockedStatusEnum[id] })).slice(0, 3);
  }
  chowDeleteIcon(): boolean {
    if (this.form.get('searchWord').value == null) return false
    else if (this.form.get('searchWord').value?.trim().length != 0) return true;
    return false;
  }
  membersToggleSearch() {
    if (!this.dropdownOpen) {
      console.log("hello");
      this.dropdownOpen = true;
      document.querySelector<HTMLElement>(".members-dropdown-list").style.display = "block";
    } else {
      this.dropdownOpen = false;
      document.querySelector<HTMLElement>(".members-dropdown-list").style.display = "none";
      console.log("none");
    }
    this.testBoolean = false;
  }

  // onClick(event) {
  //   if (event.target.classList.contains("ng-option")) this.testBoolean = false;
  //   if (
  //     this.toggle?.nativeElement?.contains(event.target) == false &&
  //     this.testBoolean
  //   )
  //     if (this.dropdownOpen) this.membersToggleSearch();

  //   this.testBoolean = true;
  // }
  search() {
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    if(this.form.controls['isActive'].value==0)
      this.form.controls['isActive'].value==false;
    else if(this.form.controls['isActive'].value==1)
      this.form.controls['isActive'].value==true;
    this.notify.emit(true);
  }

  clear() {
    this.form.controls['searchWord'].reset();
    this.form.controls['createdDate'].reset();
    this.form.controls['isActive'].reset();
    this.form.controls['isLock'].reset();
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.notify.emit(true);
  }

  clearCreatedDate(){
    this.form.controls['createdDate'].reset();
}

  export() {
    let body = this.form.getRawValue();
    console.log("this body ", body);
    let fileName = "CommitteeMembers";
    this.httpService
      .ExportExcel(MembersController.ExportCommitteeMembersToExcel(this.vendorId), body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .toPromise()
      .then((data: any) => {
        saveAs(data, `${fileName.trim()}.xlsx`);
      });
  }
  clearSearchBar() {
    this.form.controls['searchWord'].reset();
  }
}
