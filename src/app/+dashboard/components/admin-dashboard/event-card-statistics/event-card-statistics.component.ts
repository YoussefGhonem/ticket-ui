import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BaseComponent } from '@shared/base/base.component';
import { AdminDashboardController } from 'app/+dashboard/controllers/AdminDashboardController';
import { VendorDashboardController } from 'app/+dashboard/controllers/VendorDashboardController';
import { FrequencyEnum } from 'app/+dashboard/models/enums';

@Component({
  selector: 'event-card-statistics',
  templateUrl: './event-card-statistics.component.html',
  styleUrls: ['./event-card-statistics.component.scss']
})
export class EventCardStatisticsComponent extends BaseComponent implements OnInit {
  events: any[] = [];
  series: any[] = [];
  years: any[] = [];
  data: any;
  totalEvents: number;
  frequencyEnum = FrequencyEnum;
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

  loadData() {
    let body: any = this.form.getRawValue()
    this.httpService.GET(AdminDashboardController.GetEventStatistics, body)
      .subscribe((data) => {
        this.data = data?.data;
        this.totalEvents = this.data?.numberOfDraft + this.data?.numberOfPublished + this.data?.numberOfEnded + this.data?.numberOfCanceled

        if (data.earliestYear != 0) {
          console.log("=============>", data);
          this.getYears(data.earliestYear)
        }
        else {
          this.years = []
        }
      });
  }
}
