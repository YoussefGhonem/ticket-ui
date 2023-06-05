import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TableColumn } from "@libs/primeng-table/models/table-column.model";

@Component({
  selector: 'table-header-select',
  templateUrl: './table-header-select.component.html',
  styleUrls: ['./table-header-select.component.scss']
})
export class TableHeaderSelectComponent implements OnInit, OnChanges {

  @Input('columns') columns: TableColumn<any>[];
  @Input('selectedColumns') selectedColumns: TableColumn<any>[];
  @Output('onChanges') onChanges = new EventEmitter<TableColumn<any>[]>();

  constructor() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.columns);
    console.log(this.selectedColumns);
  }

  ngOnInit(): void {
  }

  fire(event: any){
    console.log(event);
    this.onChanges.emit(event);
  }

}
