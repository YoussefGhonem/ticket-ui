import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BaseComponent } from '@shared/base/base.component';
import { FormatPricePipe } from '@shared/pipes/format-price.pipe';
import { RolesEnum } from 'app/+auth/models';
import { AdminDashboardController } from 'app/+dashboard/controllers/AdminDashboardController';
import { VendorDashboardController } from 'app/+dashboard/controllers/VendorDashboardController';
import { FrequencyEnum } from 'app/+dashboard/models/enums';
import { EventsController, TicketTypesController } from 'app/+events/controllers';
import { EventStatusEnum } from 'app/+events/models';
import { UsersController } from 'app/+users/controllers';
import { debounceTime, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'profits-statistics',
  templateUrl: './profits-statistics.component.html',
  styleUrls: ['./profits-statistics.component.scss']
})
export class ProfitsStatisticsComponent extends BaseComponent implements OnInit {
  OverviewChart: any;
  series: any[] = [];
  data: any;
  years: any[] = [];
  vendors: any[] = [];
  events: any[] = [];
  ticketTypes: any[] = [];
  frequencyEnum = FrequencyEnum;
  form: UntypedFormGroup;
  xaxis: any
  yaxis: any
  totalProfits: any
  isShow: boolean = false;

  constructor(
    private _builder: UntypedFormBuilder,
    public override injector: Injector,) {
    super(injector);
  }

  ngOnInit(): void {
    this.initializeForm()
    this.loadData()
    this.loadEventsDrp()
    this._OverviewChart('["--vz-primary", "--vz-warning", "--vz-success"]');
  }

  public loadEventsDrp() {
    let filters = {
      status: EventStatusEnum.Published
    };
    this.httpService.GET(EventsController.Events, filters)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.events = res?.data;
      });
  }

  onSearchEventChange(event: any) {
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

  onSearchTicketTypeChange(event: any) {
    let value = event.target.value;
    let filters = {
      name: value
    }
    setTimeout(() => {
      this.httpService.GET(TicketTypesController.GetTicketTypesDropdown(this.form.controls['eventId'].value), filters)
        .subscribe(res => {
          console.log(res);
          this.ticketTypes = res;
        });
    }, 1000)

  }
  loadTicketTypesDrp() {
    if (this.form.controls['eventId'].value == null) return;
    this.httpService.GET(TicketTypesController.GetTicketTypesDropdown(this.form.controls['eventId'].value))
      .subscribe(res => {
        console.log(res);
        this.ticketTypes = res;
      });
  }


  loadData() {
    let body: any = this.form.getRawValue();
    if (body.year != null) body.frequency = this.frequencyEnum.Year
    this.httpService.GET(VendorDashboardController.GetProfitsStatistics, body)
      .subscribe((e) => {
        this.series = e.chart?.data;
        this.data = e.chart?.total;
        this.xaxis = this.series.map(x => x.x);
        this.yaxis = this.series.map(x => x.y);
        this._OverviewChart('["--vz-primary", "--vz-warning", "--vz-success", "--vz-secondary"]');
        if (e.earliestYear != 0) {
          console.log("data.earliestYear", e.earliestYear);
          this.getYears(e.earliestYear)
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

  initializeForm() {
    this.form = this._builder.group({
      frequency: new FormControl(FrequencyEnum.Year),
      eventId: new FormControl(null),
      ticketTypeId: new FormControl({ value: null, disabled: true }),
      year: new FormControl(new Date().getFullYear()),
    });

    this.form?.valueChanges
      .pipe(debounceTime(500))
      .subscribe(res => {
        this.loadData()
        console.log("loadData");
      });


    this.form?.controls['eventId']?.valueChanges
      .pipe(debounceTime(500))
      .subscribe(res => {
        if (this.form?.controls['eventId'].value == null) {
          this.form.controls['ticketTypeId'].reset();
          return this.form.controls['ticketTypeId'].disable();
        }
        this.form.controls['ticketTypeId'].enable();
        this.loadTicketTypesDrp()
      });
  }

  onFrequencyChange(frequencyEnum: FrequencyEnum) {
    this.form.controls['frequency'].setValue(frequencyEnum)
    this.form.controls['year'].patchValue(null)
  }


  private _OverviewChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.OverviewChart = {
      series: [{
        name: 'Events',
        type: 'bar',
        data: this.yaxis.map(x => x.eventsCount)
      }, {
        name: 'Profits',
        type: 'area',
        data: this.yaxis.map(x => x.profits)
      }, {
        name: 'Requests',
        type: 'bar',
        data: this.yaxis.map(x => x.requestsCount)
      },
      {
        name: 'Orders',
        type: 'bar',
        data: this.yaxis.map(x => x.ordersCount)
      },
      ],
      chart: {
        height: 374,
        type: 'line',
        toolbar: {
          show: false,
        }
      },
      stroke: {
        curve: 'smooth',
        dashArray: [0, 3, 0],
        width: [0, 1, 0],
      },
      fill: {
        opacity: [1, 0.1, 1]
      },
      markers: {
        size: [0, 4, 0],
        strokeWidth: 2,
        hover: {
          size: 4,
        }
      },
      xaxis: {
        categories: this.xaxis,
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: true,
          }
        },
        yaxis: {
          lines: {
            show: false,
          }
        },
        padding: {
          top: 0,
          right: -2,
          bottom: 15,
          left: 10
        },
      },
      legend: {
        show: true,
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: -5,
        markers: {
          width: 9,
          height: 9,
          radius: 6,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 0
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '30%',
          barHeight: '70%'
        }
      },
      colors: colors,
      tooltip: {
        shared: true,
        y: [{
          formatter: function (y: any) {
            if (typeof y !== "undefined") {
              return y.toFixed(0);
            }
            return y;

          }
        }, {
          formatter: function (y: any) {
            if (typeof y !== "undefined") {
              return "$" + y.toFixed(2);
            }
            return y;

          }
        }, {
          formatter: function (y: any) {
            if (typeof y !== "undefined") {
              return y.toFixed(0);
            }
            return y;

          }
        }]
      }
    };
    this.isShow = true;
  }

  // Chart Colors Set
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
}
