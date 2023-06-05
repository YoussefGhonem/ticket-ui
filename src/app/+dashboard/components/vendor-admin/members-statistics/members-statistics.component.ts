import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BaseComponent } from '@shared/base/base.component';
import { RolesEnum } from 'app/+auth/models';
import { VendorDashboardController } from 'app/+dashboard/controllers/VendorDashboardController';
import { FrequencyEnum } from 'app/+dashboard/models/enums';
import { EventsController } from 'app/+events/controllers';
import { UsersController } from 'app/+users/controllers';
import { MembersController } from 'app/+vendors/controllers';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'members-statistics',
  templateUrl: './members-statistics.component.html',
  styleUrls: ['./members-statistics.component.scss']
})
export class MembersStatisticsComponent extends BaseComponent implements OnInit {
  salesForecastChart: any;
  totalTickets: number;
  frequencyEnum = FrequencyEnum;
  members: any[] = [];
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
    this.loadMembers();
    this._salesForecastChart('["--vz-success","--vz-primary"]');
  }

  onFrequencyChange(frequencyEnum: FrequencyEnum) {
    this.form.controls['frequency'].setValue(frequencyEnum)
    this.form.controls['year'].patchValue(null)
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
      memberId: new FormControl(null),
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

    this.httpService.GET(VendorDashboardController.GetMembersStatistics, body)
      .subscribe((x) => {
        console.log("members-statistics", x);
        this.data = x?.data;
        this.series = [{ name: 'Assgin To Events', data: [this.data?.assginEvents] }, { name: 'Contacts', data: [this.data?.contacts] }]
        if (x?.earliestYear != 0) {
          this.getYears(x?.earliestYear)
        }
        else {
          this.years = []
        }
      });
  }

  public loadMembers() {

    this.httpService.GET(MembersController.GetVendorMembersByVendor, {})
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.members = res?.data;
      });
  }
  onSearchChange(event: any) {
    let value = event.target.value;
    let filters = {
      searchWord: value
    }
    setTimeout(() => {
      this.httpService.GET(MembersController.GetVendorMembersByVendor, filters)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.members = res?.data;
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
          text: 'Total Members Value',
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
