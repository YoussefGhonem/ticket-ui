import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BaseComponent } from '@shared/base/base.component';
import { VendorDashboardController } from 'app/+dashboard/controllers/VendorDashboardController';
import { FrequencyEnum } from 'app/+dashboard/models/enums';
import { EventsController } from 'app/+events/controllers';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'requests-statistics',
  templateUrl: './requests-statistics.component.html',
  styleUrls: ['./requests-statistics.component.scss']
})
export class RequestsStatisticsComponent extends BaseComponent implements OnInit {
  salesForecastChart: any;
  totalTickets: number;
  frequencyEnum = FrequencyEnum;
  events: any[] = [];
  series: any[] = [];
  years: any[] = [];
  data: any;

  form: UntypedFormGroup;

  constructor(
    private _builder: UntypedFormBuilder,
    public override injector: Injector,) {
    super(injector);
  }

  ngOnInit(): void {

    this.initializeForm();
    this.loadData();
    this.loadEvents();
    this._salesForecastChart('["--vz-success","--vz-warning","--vz-secondary ",  "--vz-danger","--vz-primary"]');
  }

  onFrequencyChange(frequencyEnum: FrequencyEnum) {
    this.form.controls['frequency'].setValue(frequencyEnum)
    this.form.controls['year'].patchValue(null)
  }


  initializeForm() {
    this.form = this._builder.group({
      eventId: new FormControl(null),
      frequency: new FormControl(FrequencyEnum.Year),
      year: new FormControl(new Date().getFullYear()),

    });

    this.form?.valueChanges
      .subscribe(res => {
        this.loadData();
      });
  }

  loadData() {
    let body: any = this.form.getRawValue()
    if (body.year != null) body.frequency = this.frequencyEnum.Year

    this.httpService.GET(VendorDashboardController.GetRequestStatistics, body)
      .subscribe((data) => {
        console.log("Ticket-statistics", data);
        this.data = data?.data;
        this.series = [{
          name: 'Approved',
          data: [this.data?.numberOfApproved]
        }, {
          name: 'Pending',
          data: [this.data?.numberOfPending]
        },
        {
          name: 'Expired',
          data: [this.data?.numberOfExpired]
        }
          ,
        {
          name: 'Rejected',
          data: [this.data?.numberOfRejected]
        },
        {
          name: 'Withdrawn',
          data: [this.data?.numberOfWithdrawn]
        }
        ]
        if (data?.earliestYear != 0) {
          this.getYears(data?.earliestYear)
        }
        else {
          this.years = []
        }
      });
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
  public loadEvents() {
    let filters = this.form.getRawValue();
    filters.endDate = filters.endDate?.toUTCString();

    this.httpService.GET(EventsController.Events, filters)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.events = res?.data;
      });
  }
  onSearchChange(event: any) {
    let value = event.target.value;
    let filters = {
      name: value
    }
    setTimeout(() => {
      this.httpService.GET(EventsController.Events, filters)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.events = res?.data;
        });
    }, 1000)

  }
  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace(" ", "");
          return color;
        }
        else return newValue;;
      } else {
        var val = value.split(',');
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }

  private _salesForecastChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.salesForecastChart = {

      chart: {
        type: 'bar',
        height: 455,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '65%',
        },
      },
      stroke: {
        show: true,
        width: 5,
        colors: ['transparent']
      },
      xaxis: {
        categories: [''],
        axisTicks: {
          show: false,
          borderType: 'solid',
          color: '#78909C',
          height: 6,
          offsetX: 0,
          offsetY: 0
        },
        title: {
          text: 'Total Requests Value',
          offsetX: 0,
          offsetY: -30,
          style: {
            color: '#78909C',
            fontSize: '12px',
            fontWeight: 400,
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function (value: any) {
            return value;
          }
        },
        tickAmount: 4,
        min: 0
      },
      fill: {
        opacity: 1
      },
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        fontWeight: 500,
        offsetX: 0,
        offsetY: -14,
        itemMargin: {
          horizontal: 8,
          vertical: 0
        },
        markers: {
          width: 10,
          height: 10,
        }
      },
      colors: colors
    };
  }

}
