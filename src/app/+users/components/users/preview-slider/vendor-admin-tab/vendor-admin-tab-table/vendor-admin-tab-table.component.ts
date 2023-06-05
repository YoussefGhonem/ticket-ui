import { Component, Injector, Input, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { TableColumn } from "@libs/primeng-table/models/table-column.model";
import { TableDataAdapterService } from "@libs/primeng-table/services/table-data-adapter.service";
import { NgbActiveModal, NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "@shared/base/base.component";
import { UsersController } from "app/+users/controllers/UsersController";
import { debounceTime } from "rxjs/operators";

@Component({
    selector: 'vendor-admin-tab-table',
    templateUrl: './vendor-admin-tab-table.component.html',
    styleUrls: ['./vendor-admin-tab-table.component.scss'],
  providers: [TableDataAdapterService]

})
export class VendorAdminTabTableComponent extends BaseComponent implements OnInit , OnDestroy {
    @Input('form') form: FormGroup;
    columns : TableColumn<any>[] = [];
    previewUser: any = null;
    @Input('user') vendorId:any;
    @Input('vendorAdmins') vendorAdmins: any[];

    constructor(
      public activeModal: NgbActiveModal, public  tableService: TableDataAdapterService,
      public modalService: NgbModal,
      public override injector: Injector,
      private offcanvasService: NgbOffcanvas) {
      super(injector);   
      
         // Table
         this.columns = [
            { title: 'Name', field: 'name', type: 'custom', visible: true, allowSorting: true },
            { title: 'Phone Number', field: 'phoneNumber', type: 'text', visible: true, allowSorting: true },
            { title: 'Status', field: 'isActive', type: 'custom', visible: true, allowSorting: true },
            { title: 'Locked', field: 'isLocked', type: 'custom', visible: true, allowSorting: true },
            { title: 'Created Date', field: 'createdDate', type: 'datetime', visible: true, allowSorting: true },
            { title: '', field: 'actions', type: 'custom', visible: true, allowSorting: false },
          ];
        }
      
  loadTable(form: any = this.form?.getRawValue()) {
    this.tableService.loadData(form, true).subscribe();
  }
    ngOnInit(): void {              
      this.tableService.setupTable(UsersController.VendorAdmin(this.vendorId), this.columns, this.form?.getRawValue());    
      this.tableService.loadData(this.form.getRawValue(), true).subscribe();
      this.form.controls['searchWord'].valueChanges
        .pipe(debounceTime(500))
        .subscribe(res => {
          this.form.controls['pageNumber'].patchValue(1, { emitEvent: false });
          this.form.controls['pageSize'].patchValue(10, { emitEvent: false });
          this.tableService.loadData(this.form?.getRawValue()).subscribe();
        });
        console.log("from table tab: ",this.vendorId);
        
    } 
    openOrderSlider(content: TemplateRef<any>, selectedUser: any) {
        this.previewUser = selectedUser;
        console.log(this.previewUser);
        this.offcanvasService.open(content, { position: 'end' });
      }
}