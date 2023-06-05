import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { MultiSelectModule } from "primeng/multiselect";
import { TableModule } from "primeng/table";
import { TableColumnComponent } from "@libs/primeng-table/components/table-column/table-column.component";
import { SharedPipesModule } from "@shared/pipes/pipes.module";
import { TableDataAdapterService } from "@libs/primeng-table/services/table-data-adapter.service";
import { FormsModule } from "@angular/forms";
import {
  TableHeaderSelectComponent
} from "@libs/primeng-table/components/table-header-select/table-header-select.component";


@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    ButtonModule,
    MultiSelectModule,
    TableModule,
    SharedPipesModule,
    FormsModule
  ],
  declarations: [
    TableColumnComponent,
    TableHeaderSelectComponent
  ],
  exports: [
    TableModule,
    MultiSelectModule,
    TableColumnComponent,
    TableHeaderSelectComponent
  ],
  providers: [TableDataAdapterService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrimengTableModule {
}
