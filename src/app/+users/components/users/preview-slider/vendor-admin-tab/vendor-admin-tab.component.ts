import { Component,OnInit, Input, Injector, ViewChild  } from "@angular/core";
import { BaseComponent } from "@shared/base/base.component";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { SortOptionsEnum } from "@shared/models/BaseModels/enums";
import { debounceTime, takeUntil } from "rxjs/operators";
import { UsersController } from "app/+users/controllers";
import { VendorAdminTabTableComponent } from "./vendor-admin-tab-table/vendor-admin-tab-table.component";


@Component({
    selector: 'vendor-admin-tab',
    templateUrl: './vendor-admin-tab.component.html',
    styleUrls: ['./vendor-admin-tab.component.scss'],

})
export class VendorAdminTabComponent extends BaseComponent implements OnInit {
    @ViewChild(VendorAdminTabTableComponent) vendorAdminTableComponent:VendorAdminTabTableComponent;
    @Input('user') user:any;    
    form: FormGroup;
    sortedEnum = SortOptionsEnum;
    total:number=10;    
    vendorAdmins:any[];
    vendorId:any;

    constructor(public override injector: Injector,private _formBuilder: FormBuilder){
        super(injector);
    }

    ngOnInit(): void {
        console.log(this.user);
        this.initSearchForm();        
        this.vendorId=this.user.businessId;
        this.loadVendorAdmins();        
    }

    search(){
        this.loadVendorAdmins();
    }

    loadVendorAdmins(){      
      let filters = this.form.getRawValue();
      
      filters.createdDate = filters.createdDate?.toUTCString();

      this.httpService.GET(UsersController.VendorAdmin(this.vendorId),filters)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res=>{
        this.vendorAdmins=res?.data;
        this.total=res?.total;   
      })
      this.vendorAdminTableComponent?.loadTable(filters);
    }
       
  pageChange(pageNumber: number) {
    this.form.controls['pageNumber'].patchValue(pageNumber, { emitEvent: false });
    this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
    this.loadVendorAdmins()
  }

  private initSearchForm(): void {
    this.form = this._formBuilder.group({
      // Pagination
      pageNumber: new FormControl(1),
      pageSize: new FormControl(10),
      //filters
      searchWord:new FormControl(null),
      vendorId: new FormControl(null),
      createdDate: new FormControl(null),
      isActive: new FormControl(null),
      isLock: new FormControl(null),
      currentTimeZoneDifferenceInMinutes: new FormControl((new Date()).getTimezoneOffset())
    });
    
    
    this.form.controls['searchWord'].valueChanges
      .pipe(debounceTime(500))
      .subscribe(res => {
        this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
        this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
        this.loadVendorAdmins();
      });
  }
}