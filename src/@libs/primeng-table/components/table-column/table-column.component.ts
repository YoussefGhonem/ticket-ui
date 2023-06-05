import { Component, Input, OnChanges } from '@angular/core';
import { TableColumn } from "@libs/primeng-table/models/table-column.model";
import { ExtractNestedValuePipe } from '@shared/pipes/extract-nested-value.pipe';


@Component({
  selector: 'table-column',
  templateUrl: './table-column.component.html',
  styleUrls: ['./table-column.component.scss']
})
export class TableColumnComponent implements OnChanges {

  @Input('dataItem') dataItem: any;
  @Input('option') option: TableColumn<any>;
  value: any;

  constructor() {
  }

  ngOnChanges() {
    if (this.dataItem && this.option) {
      this.value = new ExtractNestedValuePipe().transform(this.dataItem, this.option?.field as string);
    }
  }

}
