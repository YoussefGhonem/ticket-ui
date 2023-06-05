import { Component, OnInit, Output, EventEmitter, Injector, Input } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, UntypedFormBuilder } from "@angular/forms";
import { BaseComponent } from "@shared/base/base.component";
import { SortOptionsEnum } from "@shared/models/BaseModels/enums";
import { UsersController } from "app/+users/controllers";
import { IsActiveStatusEnum, IsLockedStatusEnum } from "app/+users/models";
import * as saveAs from "file-saver";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'vendor-admin-tab-filter',
  templateUrl: './vendor-admin-tab-filter.component.html',
  styleUrls: ['./vendor-admin-tab-filter.component.scss']
})
export class VendorAdminTabFilterComponent extends BaseComponent implements OnInit {
  public dropdownOpen: boolean = false;
  testBoolean: boolean = false;
  @Input('form') form: FormGroup;
  @Input('user') vendorId: any;
  sortedEnum = SortOptionsEnum;
  @Output('notify') notify = new EventEmitter<boolean>();
  isActiveStatus: any[];
  isLockedStatus: any[];

  constructor(public override injector: Injector, private _formBuilder: FormBuilder) {
    super(injector);

  }

  ngOnInit(): void {

  }


  toggleSearch() {
    if (!this.dropdownOpen) {
      console.log("hello");
      this.dropdownOpen = true;
      document.querySelector<HTMLElement>(".events-dropdown-list").style.display = "block";
    } else {
      this.dropdownOpen = false;
      document.querySelector<HTMLElement>(".events-dropdown-list").style.display = "none";
      console.log("none");
    }
    this.testBoolean = false;
  }
  search() {
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    if (this.form.controls['isActive'].value == 0)
      this.form.controls['isActive'].value == false;
    else if (this.form.controls['isActive'].value == 1)
      this.form.controls['isActive'].value == true;
    this.notify.emit(true);
  }
  chowDeleteIcon(): boolean {
    if (this.form.get('searchWord').value == null) return false
    else if (this.form.get('searchWord').value?.trim().length != 0) return true;
    return false;
  }
  export() {
    // let body = this.getBody();
    let body = this.form.getRawValue();
    this.httpService.ExportExcel(UsersController.ExportVendorAdmin(this.vendorId), body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .toPromise()
      .then((data: any) => {
        saveAs(data, `Vendor admins.xlsx`);
      });
  }

  clearCreatedDate() {
    this.form.controls['createdDate'].reset();
  }

  clear() {
    // here clear spacific controls becouse i didin't want clear sortField and sortOrder
    this.form.controls['searchWord'].reset();
    this.form.controls['createdDate'].reset();
    this.form.controls['isActive'].reset();
    this.form.controls['isLock'].reset();
    this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.notify.emit(true);
  }

  clearSearchBar() {
    this.form.controls['searchWord'].reset();
  }
}