import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BaseComponent } from '@shared/base/base.component';
import { VendorDashboardController } from 'app/+dashboard/controllers/VendorDashboardController';
import { FrequencyEnum } from 'app/+dashboard/models/enums';

@Component({
  selector: 'event-statistics',
  templateUrl: './event-statistics.component.html',
  styleUrls: ['./event-statistics.component.scss']
})
export class EventStatisticsComponent extends BaseComponent implements OnInit {
  frequencyEnum = FrequencyEnum;
  events: any[] = [];
  series: any[] = [];
  years: any[] = [];

  data: any;
  totalEvents: number;
  form: UntypedFormGroup;

  constructor(
    private _builder: UntypedFormBuilder,
    public override injector: Injector,) {
    super(injector);
  }

  onFrequencyChange(frequencyEnum: FrequencyEnum) {
    this.form.controls['frequency'].setValue(frequencyEnum)
    this.form.controls['year'].patchValue(null)
  }

  ngOnInit(): void {
    this.initializeForm()
    this.loadData();
  }

  getYears(earliestYear: number) {
    let date = new Date();
    let year = date.getFullYear();
    let i = year - earliestYear
    this.years = []
    for (let x = 1; x <= i; x++) {
      this.years.push(earliestYear + x);
    }
    this.years.push(earliestYear);
    this.years = this.years.sort();
  }
  initializeForm() {
    this.form = this._builder.group({
      frequency: new FormControl(FrequencyEnum.Year),
      year: new FormControl(new Date().getFullYear()),

    });

    this.form?.valueChanges
      .subscribe(res => {
        this.loadData();
      });
  }
  getPercentage(value): number {
    return ((value / this.totalEvents) * 100);
  }
  loadData() {
    let body: any = this.form.getRawValue()
    if (body.year != null) body.frequency = this.frequencyEnum.Year

    this.httpService.GET(VendorDashboardController.GetEventStatistics, body)
      .subscribe((data) => {
        this.data = data?.data;
        this.totalEvents = this.data?.numberOfDraft + this.data?.numberOfPublished + this.data?.numberOfEnded + this.data?.numberOfCanceled
        if (data?.earliestYear != 0) {
          this.getYears(data?.earliestYear)
        }
        else {
          this.years = []
        }
      });
  }

}
