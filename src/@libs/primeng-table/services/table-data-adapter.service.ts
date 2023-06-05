import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import {tap} from "rxjs/operators"
import { HttpService } from "@shared/services";
import { TableColumn } from "@libs/primeng-table/models/table-column.model";
import { SortOptionsEnum } from "@libs/primeng-table/models/enums";
import { FormGroup } from '@angular/forms';

@Injectable()
export class TableDataAdapterService {

  public options = {
    lazy: true,
    rows: 10,
    paginator: true,
    rowsPerPageOptions: [10, 25, 50],
    showCurrentPageReport: true,
    currentPageReportTemplate: 'Showing {first} to {last} of {totalRecords} entries',
    styleClass: 'p-datatable-striped p-datatable-responsive-demo',
    responsiveLayout: 'scroll'
  };
  public data$ = new BehaviorSubject<any[]>([]);
  public total$ = new BehaviorSubject<number>(0);
  public columns: TableColumn<any>[];
  data: any[] = [];
  total: number = 0;
  query: any;
  private _selectedColumns: TableColumn<any>[];
  private dataUrl: string;
  private filters: object;
  

  form: FormGroup = null;

  public pagingAndSorting: { pageNumber: number, pageSize: number, sortOrder: SortOptionsEnum, sortField: string } = {
    pageNumber: 1,
    pageSize: 10,
    sortOrder: SortOptionsEnum.Ascending,
    sortField: null
  }

  constructor(private httpService: HttpService) {
  }

  setupTable(dataUrl: string, columns: TableColumn<any>[], filters: object, form: FormGroup = null) {
    this.dataUrl = dataUrl;
    this.filters = filters;

    this.columns = columns;
    this._selectedColumns = this.columns.filter(x => x.visible);
    this.form = form;
  }

  get selectedColumns(): TableColumn<any>[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: TableColumn<any>[]) {
    // restore original order
    this._selectedColumns = this.columns.filter(col => val.map(x => x.title.toLowerCase().trim()).includes(col.title.toLowerCase().trim()));
  }

  public onLazyLoad(event: any) {
    this.pagingAndSorting.pageNumber = (event.first / event.rows) + 1;
    this.pagingAndSorting.pageSize = event.rows;
    this.pagingAndSorting.sortOrder = event.sortOrder == 1 ? SortOptionsEnum.Ascending : SortOptionsEnum.Descending;
    this.pagingAndSorting.sortField = event.sortField ?? null;

    if(this.form != null){
      let body = this.form.getRawValue();
      if(this.pagingAndSorting.pageNumber != body.pageNumber) this.form.controls['pageNumber'].patchValue(this.pagingAndSorting.pageNumber);
      if(this.pagingAndSorting.pageNumber != body.pageSize) this.form.controls['pageSize'].patchValue(this.pagingAndSorting.pageSize);
      if(this.pagingAndSorting.pageNumber != body.sortField) this.form.controls['sortField'].patchValue(this.pagingAndSorting.sortField);
      if(this.pagingAndSorting.pageNumber != body.sortOrder) this.form.controls['sortOrder'].patchValue(this.pagingAndSorting.sortOrder);
    }

    console.log(' onLazyLoad ===> ');
    this.loadData(this.filters, true).subscribe();
    var refreshIntervalId = setInterval(() => {
      this.setPrimeNgStyles();
    }, 0);
  }

  public loadData(filter: object = this.filters, _continue: boolean = false): Observable<any[]> {
    this.filters = filter;
    const query = { ...filter, ...this.pagingAndSorting }

    this.query = query;

    console.log('Table Query ===> ', query)

    return this.httpService.GET(this.dataUrl, query)
    .pipe(tap(res => {
      this.total$.next(res?.total);
      this.total = res?.total;
      this.data$.next(res?.data);
      this.data = res?.data;
      console.log("data", res?.data);
    }));
  }

  // this method to check if found data or not ( use it in html to display #emptyTemp)
  get dataList(): any[] {
    return this.data;
  }

  setPrimeNgStyles() {
    let primNgStyleLocalStorage = localStorage.getItem('theme');
    if (primNgStyleLocalStorage == 'light') {
      this.primNgStyles(true);
      document.body.setAttribute('data-layout-mode', "light");
      document.body.setAttribute('data-sidebar', "light");
    }
    else {
      this.primNgStyles();
      document.body.setAttribute('data-layout-mode', "dark");
      document.body.setAttribute('data-sidebar', "dark");
    }
  }

  primNgStyles(rest: boolean = false) {
    let dark = 'dark'
    let light = 'light'
    let backgroundColor = rest ? '' : '#2a2f34';
    let color = rest ? '' : 'rgb(188 194 199)';

    // save to local storge
    localStorage.setItem('theme', rest ? light : dark);

    if (document.querySelector('.p-datatable .p-datatable-header') == null)
      return;

    var divs = document.querySelectorAll('.p-datatable .p-datatable-tbody > tr');
    var divs2 = document.querySelectorAll('.p-datatable .p-datatable-thead > tr > th');
    var divs4 = document.querySelectorAll('.p-datatable.p-datatable-striped .p-datatable-tbody > tr:nth-child(even)');
    var divs3 = document.querySelectorAll('.p-datatable .p-sortable-column .p-column-title, .p-datatable .p-sortable-column .p-sortable-column-icon, .p-datatable .p-sortable-column .p-sortable-column-badge');
    var divs5 = document.querySelectorAll('.p-datatable .p-datatable-tbody td');

    [].forEach.call(divs, function (div) {
      // do whatever
      div.style.backgroundColor = backgroundColor;
      div.style.color = color;
    });

    [].forEach.call(divs2, function (div) {
      // do whatever
      div.style.backgroundColor = backgroundColor;
      div.style.borderBottom = rest ? '' : '1px solid #858789';
      div.style.color = color;
    });
    [].forEach.call(divs3, function (div) {
      // do whatever
      div.style.color = color;
    });
    [].forEach.call(divs4, function (div) {
      // do whatever
      div.style.backgroundColor = rest ? '' : 'rgb(63 66 69)';
      div.style.color = color;
    });
    [].forEach.call(divs5, function (div) {
      // do whatever
      div.style.borderBottom = rest ? '' : '1px solid #858789';
    });


    // @ts-ignore
    document.querySelector('.p-datatable .p-datatable-header').style.backgroundColor = backgroundColor;
    // @ts-ignore
    document.querySelector('.p-datatable .p-datatable-header').style.borderWidth = rest ? '' : '0 0 0px 0';
    // @ts-ignore
    document.querySelector('.p-paginator-bottom').style.backgroundColor = backgroundColor;
    // @ts-ignore
    document.querySelector('.p-datatable .p-paginator-bottom').style.borderWidth = rest ? '' : '0 0 0px 0';
    // @ts-ignore
    document.querySelector('.p-datatable-header .ng-star-inserted').style.backgroundColor = backgroundColor;
    // @ts-ignore
    document.querySelector('.p-multiselect').style.backgroundColor = backgroundColor;
    // @ts-ignore
    document.querySelector('.p-multiselect').style.color = color;
    // @ts-ignore
    document.querySelector('.p-dropdown').style.background = rest ? '' : 'rgb(75 77 79)';
    // @ts-ignore
    document.querySelector('.p-paginator .p-dropdown .p-dropdown-label').style.color = color;
  }

}
