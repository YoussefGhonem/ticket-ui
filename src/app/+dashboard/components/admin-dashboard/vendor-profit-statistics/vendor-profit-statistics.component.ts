import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BaseComponent } from '@shared/base/base.component';
import { RolesEnum } from 'app/+auth/models';
import { AdminDashboardController } from 'app/+dashboard/controllers/AdminDashboardController';
import { FrequencyEnum } from 'app/+dashboard/models/enums';
import { EventsController, TicketTypesController } from 'app/+events/controllers';
import { EventStatusEnum } from 'app/+events/models';
import { UsersController } from 'app/+users/controllers';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'vendor-profit-statistics',
  templateUrl: './vendor-profit-statistics.component.html',
  styleUrls: ['./vendor-profit-statistics.component.scss']
})
export class VendorProfitStatisticsComponent extends BaseComponent implements OnInit {
  gradientChart: any;
  series: any[] = [];
  years: any[] = [];
  vendors: any[] = [];
  events: any[] = [];
  ticketTypes: any[] = [];
  frequencyEnum = FrequencyEnum;
  form: UntypedFormGroup;
  xaxis: any
  yaxis: any
  isShow: boolean = false;

  constructor(
    private _builder: UntypedFormBuilder,
    public override injector: Injector,) {
    super(injector);
  }

  ngOnInit(): void {
    this.initializeForm()
    this.loadData()
    this.loadVendorsDrp()
    this._gradientChart('[ "--vz-success"]');
  }

  public loadEventsDrp() {
    if (this.form.controls['vendorId'].value == null) return;
    let filters = {
      vendorId: this.form.controls['vendorId'].value,
      status: EventStatusEnum.Published
    };
    this.httpService.GET(EventsController.EventsDrp, filters)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.events = res;
        console.log("this.events", res);
      });
  }

  loadTicketTypesDrp() {
    if (this.form.controls['eventId'].value == null) return;
    this.httpService.GET(TicketTypesController.GetTicketTypesDropdown(this.form.controls['eventId'].value))
      .subscribe(res => {
        console.log(res);
        this.ticketTypes = res;
      });
  }

  public loadVendorsDrp() {

    let filters = {
      role: RolesEnum.Vendor
    };
    this.httpService.GET(UsersController.UsersDrp, filters)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.vendors = res;
      });
  }

  loadData() {
    let body: any = this.form.getRawValue()
    if (body.year != null) body.frequency = this.frequencyEnum.Year

    this.httpService.GET(AdminDashboardController.GetProfitsStatistics, body)
      .subscribe((data) => {
        this.series = data.chart;
        this.xaxis = this.series.map(x => x.x);
        this.yaxis = this.series.map(x => x.y);
        this._gradientChart('[ "--vz-success"]');
        if (data.earliestYear != 0) {
          console.log("data.earliestYear", data.earliestYear);
          this.getYears(data.earliestYear)
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
      ticketTypeId: new FormControl({ value: null, disabled: true }),
      eventId: new FormControl({ value: null, disabled: true }),
      vendorId: new FormControl(null),
      year: new FormControl(new Date().getFullYear()),
    });

    this.form?.valueChanges
      .pipe(debounceTime(500))
      .subscribe(res => {
        this.loadData()
        console.log("loadData");
      });

    this.form?.controls['vendorId']?.valueChanges
      .pipe(debounceTime(500))
      .subscribe(res => {
        if (this.form?.controls['vendorId'].value == null) {
          this.form.controls['ticketTypeId'].disable();
          return this.form.controls['eventId'].disable();
        }
        this.form.controls['eventId'].enable();
        this.loadEventsDrp()
        console.log("loadEventsDrp");

      });

    this.form?.controls['eventId']?.valueChanges
      .pipe(debounceTime(500))
      .subscribe(res => {
        if (this.form?.controls['eventId'].value == null) return;
        this.form.controls['ticketTypeId'].enable();
        this.loadTicketTypesDrp()
      });
  }

  onFrequencyChange(frequencyEnum: FrequencyEnum) {
    this.form.controls['frequency'].setValue(frequencyEnum)
    this.form.controls['year'].patchValue(null)
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
        else return newValue;
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

  private _gradientChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.gradientChart = {
      series: [{
        name: 'Vendor Profits',
        data: this.yaxis
      }],
      chart: {
        height: 350,
        type: 'line',
        toolbar: {
          show: false
        },
      },
      stroke: {
        width: 7,
        curve: 'smooth'
      },
      xaxis: {
        categories: this.xaxis,
        tickAmount: 10,
      },
      title: {
        text: 'Social Media',
        align: 'left',
        style: {
          fontWeight: 500,
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#09b29e'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        },
      },
      markers: {
        size: 4,
        colors: colors,
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7,
        }
      },
      // yaxis: {
      //   min: -10,
      //   max: 40,
      //   title: {
      //     text: 'Engagement',
      //   },
      // }
    };
  }

}
