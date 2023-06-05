import { Component, Injector, OnInit } from "@angular/core";
import { SettingsController } from "app/+settings/controllers";
import { BaseComponent } from "@shared/base/base.component";
import { debounceTime, takeUntil } from "rxjs/operators";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { TableColumn } from "@libs/primeng-table/models/table-column.model";
import { TableDataAdapterService } from "@libs/primeng-table/services/table-data-adapter.service";

@Component({
  selector: "app-countries",
  templateUrl: "./countries.component.html",
  styleUrls: ["./countries.component.scss"],
})
export class CountriesComponent extends BaseComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  countries: any[] = [];
  total: number = 0;
  form!: FormGroup;
  columns: TableColumn<any>[] = [];

  constructor(
    public override injector: Injector,
    private _formBuilder: FormBuilder,
    public tableService: TableDataAdapterService
  ) {
    super(injector);
    this.columns = [
      {
        title: "Flag",
        field: "flag",
        type: "image",
        visible: true,
        allowSorting: false,
      },
      {
        title: "Name",
        field: "name",
        type: "text",
        visible: true,
        allowSorting: true,
      },
      {
        title: "Capital",
        field: "capital",
        type: "text",
        visible: true,
        allowSorting: true,
      },
      {
        title: "Language",
        field: "language",
        type: "text",
        visible: true,
        allowSorting: true,
      },
      {
        title: "Currency",
        field: "currency",
        type: "text",
        visible: true,
        allowSorting: true,
      },
      {
        title: "Native Name",
        field: "nativeName",
        type: "text",
        visible: true,
        allowSorting: true,
      },
      {
        title: "Calling Code",
        field: "callingCode",
        type: "text",
        visible: true,
        allowSorting: true,
      },
      {
        title: "Area",
        field: "area",
        type: "number",
        visible: true,
        allowSorting: true,
      },
      {
        title: "Alpha2 Code",
        field: "alpha2Code",
        type: "text",
        visible: true,
        allowSorting: true,
      },
      {
        title: "Alpha3 Code",
        field: "alpha3Code",
        type: "text",
        visible: true,
        allowSorting: true,
      },
      {
        title: "Description",
        field: "description",
        type: "text",
        visible: true,
        allowSorting: false,
      },
    ];
    this.initSearchForm();
    this.tableService.setupTable(
      SettingsController.Countries,
      this.columns,
      this.form?.getRawValue()
    );
  }
  clearSearchBar() {
    this.form.controls['name'].reset();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Settings" },
      { label: "Countries", active: true },
    ];
  }
  showDeleteIcon(): boolean {
    if (this.form.get('name').value == null) return false
    else if (this.form.get('name').value?.trim().length != 0) return true;
    return false;
  }

  private initSearchForm(): void {
    this.form = this._formBuilder.group({
      name: new FormControl(null),
      isActive: new FormControl(""),
    });

    this.form.valueChanges.pipe(debounceTime(500)).subscribe((res) => {
      this.tableService.loadData(this.form.getRawValue()).subscribe();
    });
  }
}
