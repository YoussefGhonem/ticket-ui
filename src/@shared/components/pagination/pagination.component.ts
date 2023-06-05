import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input('total') total: number = 0;
  @Input('pageNumber') pageNumber: number = 1;
  @Input('pageSize') pageSize: number = 10;
  @Output('pageChange') pageChange = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
